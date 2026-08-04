import { 
  FaShieldAlt, 
  FaHandshake, 
  FaHeadset, 
  FaClock, 
  FaCar, 
  FaDollarSign 
} from 'react-icons/fa';

/**
 * Why Choose Us section with key selling points
 */
export default function WhyChooseUs() {
  const features = [
    {
      icon: FaShieldAlt,
      title: 'Trusted & Secure',
      description: 'All transactions are encrypted and secured. Your data and payments are always protected.',
      color: 'blue',
    },
    {
      icon: FaHandshake,
      title: 'Best Price Guarantee',
      description: 'We match any legitimate offer. Get the best value for your money with our price match promise.',
      color: 'green',
    },
    {
      icon: FaHeadset,
      title: '24/7 Support',
      description: 'Our dedicated team is always available to assist you with any questions or concerns.',
      color: 'purple',
    },
    {
      icon: FaClock,
      title: 'Quick Process',
      description: 'Fast and efficient service. Get your car delivered or sold within days, not weeks.',
      color: 'orange',
    },
    {
      icon: FaCar,
      title: 'Quality Assurance',
      description: 'Every vehicle undergoes rigorous inspection to ensure top quality and reliability.',
      color: 'red',
    },
    {
      icon: FaDollarSign,
      title: 'Flexible Financing',
      description: 'Customized payment plans with competitive rates. Drive your dream car today.',
      color: 'indigo',
    },
  ];

  const colorMap = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    indigo: 'bg-indigo-100 text-indigo-600',
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose <span className="gradient-text">CarVault</span>
          </h2>
          <p className="text-lg text-gray-600">
            Experience the best car buying and selling journey with our premium services
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-gray-50 hover:bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-xl ${colorMap[feature.color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}