"use client";

import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

export function ServicesSection() {
  const services = [
    {
      id: "cleaning",
      title: "Home Cleaning",
      description: "Professional deep cleaning services for your entire home",
      icon: "🧹",
      features: ["Deep cleaning", "Regular maintenance", "Eco-friendly products"],
      popular: true,
    },
    {
      id: "plumbing",
      title: "Plumbing",
      description: "Expert repairs and installations for all plumbing needs",
      icon: "🔧",
      features: ["Leak repairs", "Pipe installation", "Emergency services"],
      popular: false,
    },
    {
      id: "electrical",
      title: "Electrical",
      description: "Certified electricians for safe electrical work",
      icon: "⚡",
      features: ["Wiring installation", "Outlet repair", "Safety inspections"],
      popular: false,
    },
    {
      id: "cooking",
      title: "Cooking",
      description: "Professional cooking and meal preparation services",
      icon: "🍳",
      features: ["Meal planning", "Grocery shopping", "Healthy recipes"],
      popular: false,
    },
    {
      id: "landscaping",
      title: "Landscaping",
      description: "Garden design and maintenance services",
      icon: "🌱",
      features: ["Garden design", "Lawn care", "Seasonal cleanup"],
      popular: false,
    },
    {
      id: "moving",
      title: "Moving Services",
      description: "Professional moving and packing assistance",
      icon: "📦",
      features: ["Packing service", "Transportation", "Unpacking help"],
      popular: false,
    },
  ];

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Professional Home Services
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              From routine maintenance to emergency repairs, we provide reliable,
              high-quality home services to keep your property in perfect condition.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6">
                  <div className="flex flex-col">
                    {/* Service Icon */}
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>

                    {/* Service Title & Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-foreground">
                        {service.title}
                      </h3>
                      {service.popular && (
                        <span className="inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium bg-primary text-primary-foreground border-primary/20">
                          Popular
                        </span>
                      )}
                    </div>

                    {/* Service Description */}
                    <p className="text-muted-foreground mb-4 flex-grow">
                      {service.description}
                    </p>

                    {/* Service Features */}
                    <div className="space-y-2 mb-6">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                          {feature}
                        </div>
                      ))}
                    </div>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <p className="text-muted-foreground mb-6">
              Need a custom service package? We're here to help!
            </p>
            <button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 py-3 px-8 rounded-lg font-medium transition-colors duration-300">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
