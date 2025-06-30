
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

// Mock data for testimonials
const TESTIMONIALS = [
  {
    id: '1',
    content: 'FlavorShare has transformed my cooking experience! I\'ve discovered so many amazing recipes that have become family favorites. The step-by-step instructions are always clear and easy to follow.',
    author: 'Sarah Johnson',
    role: 'Home Cook',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80'
  },
  {
    id: '2',
    content: 'As a busy parent, I need quick and healthy meal ideas. This platform has been a lifesaver with its amazing collection of family-friendly recipes that my kids actually eat!',
    author: 'Michael Torres',
    role: 'Parent of 3',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80'
  },
  {
    id: '3',
    content: 'I love being able to share my grandmother\'s recipes with a community that appreciates traditional cooking. The feedback I\'ve received has been so heartwarming!',
    author: 'Elena Rodriguez',
    role: 'Food Enthusiast',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80'
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">What Our Community Says</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of food lovers already sharing and discovering recipes
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial) => (
            <Card 
              key={testimonial.id} 
              className="bg-white hover:shadow-lg transition-shadow border-transparent hover:border-sage-200"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.author} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <Separator className="mb-4" />
                <div className="relative">
                  <Quote className="h-5 w-5 absolute -top-2 -left-1 text-sage-300 opacity-50" />
                  <blockquote className="text-gray-600 italic pt-2 pl-4">
                    "{testimonial.content}"
                  </blockquote>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-xl font-display font-medium text-sage-500">
            Join our community today and start sharing your culinary creations!
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
