import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { sendAppointmentConfirmation } from '@/lib/email';

export async function POST(request) {
  try {
    const db = await connectDB();
    const data = await request.json();

    // Validation
    if (!data.name || !data.email || !data.phone || !data.date || !data.time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slot already booked
    const existing = await db.collection('appoinment').findOne({
      date: data.date,
      time: data.time,
      status: { $ne: 'cancelled' },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 409 }
      );
    }

    const appointment = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      location: data.location || { district: '', area: '' },
      customLocation: data.customLocation || '',
      note: data.note || '',
      date: data.date,
      time: data.time,
      status: 'pending',
      createdAt: new Date(),
    };

    const result = await db.collection('appoinment').insertOne(appointment);

    // ✅ Send confirmation email (fire and forget)
    // Email fail korleo appointment MongoDB te save thakbe
    let emailStatus = 'sent';
    try {
      const emailResult = await sendAppointmentConfirmation({
        name: appointment.name,
        email: appointment.email,
        phone: appointment.phone,
        date: appointment.date,
        time: appointment.time,
        location: appointment.location,
        customLocation: appointment.customLocation,
        note: appointment.note,
      });

      if (!emailResult.success) {
        emailStatus = 'failed';
        console.error('Email send failed:', emailResult.error);
      }
    } catch (emailErr) {
      emailStatus = 'failed';
      console.error('Email confirmation error:', emailErr);
    }

    return NextResponse.json(
      {
        appointment: { _id: result.insertedId, ...appointment },
        emailStatus,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const db = await connectDB();
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    const query = { status: { $ne: 'cancelled' } };
    if (date) query.date = date;

    const appointments = await db
      .collection('appoinment')
      .find(query)
      .toArray();

    // Return only booked slots (date + time) — for UI to disable
    const bookedSlots = appointments.map((a) => ({
      date: a.date,
      time: a.time,
    }));

    return NextResponse.json({ bookedSlots });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}