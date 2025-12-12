import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Factory, TrendingUp, Zap, Shield, Code, Users } from "lucide-react";

const features = [
  {
    icon: <Factory className="h-6 w-6" />,
    title: "Factory Location Optimization",
    description:
      "Determine optimal factory placement considering capacity, costs, and market proximity.",
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Cost Minimization",
    description:
      "Reduce total supply chain costs including transportation, production, and facility costs.",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Fast Computation",
    description:
      "Get optimization results in seconds using advanced algorithms and efficient processing.",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Data Security",
    description:
      "Your uploaded data is processed securely and never stored on our servers.",
  },
  {
    icon: <Code className="h-6 w-6" />,
    title: "Multiple Objectives",
    description:
      "Choose from various optimization objectives: minimize cost, distance, or maximize coverage.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Easy to Use",
    description:
      "Simple interface designed for both technical and non-technical users.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              About OptiFlow
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              OptiFlow is a powerful supply chain optimization tool designed to
              help businesses find the optimal factory-to-market assignments and
              minimize operational costs.
            </p>
          </div>

          {/* Mission */}
          <Card className="mb-8 shadow-card animate-slide-up">
            <CardHeader>
              <CardTitle className="text-xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                We believe that every business deserves access to advanced
                optimization tools. OptiFlow democratizes supply chain
                optimization by providing an intuitive interface that transforms
                complex logistics problems into actionable insights. Whether
                you're managing a small distribution network or a global supply
                chain, our platform scales to meet your needs.
              </p>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <h2 className="text-2xl font-semibold mb-6">Key Features</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="shadow-card hover:shadow-card-lg transition-shadow duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="p-2 rounded-lg bg-accent text-accent-foreground w-fit mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How It Works */}
          <Card className="shadow-card animate-slide-up">
            <CardHeader>
              <CardTitle className="text-xl">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Upload Your Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Upload Xlsx files containing your factory locations, market
                    demands, and transportation costs.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Configure Parameters</h4>
                  <p className="text-sm text-muted-foreground">
                    Set your budget constraints, maximum number of factories,
                    and choose your optimization objective.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Run Optimization</h4>
                  <p className="text-sm text-muted-foreground">
                    Our algorithm finds the optimal solution, showing you which
                    factories to open and how to allocate shipments.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Analyze & Export</h4>
                  <p className="text-sm text-muted-foreground">
                    Review results in the interactive table and map, then export
                    your optimized assignments.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>OptiFlow — Supply Chain Optimization Platform</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
