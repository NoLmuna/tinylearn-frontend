import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { BookOpen, Gamepad2, TrendingUp, MessageCircle, Sparkles, ArrowRight, CheckCircle2, Star, Heart, Smile, Zap, Gift } from 'lucide-react';

/**
 * Landing Page Component
 * Modern landing page with hero, features, about, and contact sections
 */
function Landing() {
  const features = [
    {
      icon: BookOpen,
      emoji: "📚",
      title: "Interactive Lessons",
      description: "Fun and colorful lessons that make learning feel like playtime!",
      color: "bg-gradient-to-br from-[#FFE5B4] via-[#FFF9E6] to-[#FFEAA7]",
      iconBg: "bg-gradient-to-br from-[#F4C21A] to-[#FFD93D]",
      iconColor: "text-black",
      borderColor: "border-[#F4C21A]"
    },
    {
      icon: Gamepad2,
      emoji: "🎮",
      title: "Educational Games",
      description: "Play exciting games while learning amazing new things!",
      color: "bg-gradient-to-br from-[#FFD6E8] via-[#FFE6F0] to-[#FFC8DD]",
      iconBg: "bg-gradient-to-br from-[#FF6B9D] to-[#F72585]",
      iconColor: "text-white",
      borderColor: "border-[#FF6B9D]"
    },
    {
      icon: TrendingUp,
      emoji: "🌟",
      title: "Track Your Progress",
      description: "Watch yourself grow and collect awesome achievements!",
      color: "bg-gradient-to-br from-[#C7E9FB] via-[#E3F2FD] to-[#A2D2FF]",
      iconBg: "bg-gradient-to-br from-[#4CC9F0] to-[#4361EE]",
      iconColor: "text-white",
      borderColor: "border-[#4CC9F0]"
    },
    {
      icon: MessageCircle,
      emoji: "💬",
      title: "Stay Connected",
      description: "Parents and tutors can chat and share your amazing progress!",
      color: "bg-gradient-to-br from-[#D5F5D5] via-[#E8F5E9] to-[#B7E4C7]",
      iconBg: "bg-gradient-to-br from-[#52B788] to-[#2D6A4F]",
      iconColor: "text-white",
      borderColor: "border-[#52B788]"
    }
  ];

  const testimonials = [
    {
      name: "Maria Santos",
      role: "Parent",
      content: "TinyLearn has transformed my child's learning experience. The interactive lessons keep them engaged and excited to learn every day!",
      rating: 5,
      avatar: "👩"
    },
    {
      name: "John Reyes",
      role: "Tutor",
      content: "As an educator, I appreciate the comprehensive tools TinyLearn provides. It makes tracking student progress incredibly easy.",
      rating: 5,
      avatar: "👨‍🏫"
    },
    {
      name: "Linda Cruz",
      role: "Parent",
      content: "The communication features are fantastic! I can stay connected with my child's tutor and monitor their progress in real-time.",
      rating: 5,
      avatar: "👩‍💼"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9E6] via-[#F9F9F9] to-[#FFF0F5]">
      <Navbar />
      
      {/* Hero Section */}
      <section id="home" className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Playful background elements */}
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-bounce">⭐</div>
        <div className="absolute top-40 right-20 text-5xl opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}>🎨</div>
        <div className="absolute bottom-20 left-1/4 text-4xl opacity-20 animate-bounce" style={{ animationDelay: '1s' }}>🚀</div>
        <div className="absolute top-60 right-10 text-5xl opacity-20 animate-bounce" style={{ animationDelay: '1.5s' }}>🎈</div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center animate-fade-in-up">
            <Badge className="mb-8 text-base py-3 px-6 shadow-lg">
              <Sparkles className="w-5 h-5 mr-2 inline animate-pulse" />
              ✨ Let's Make Learning Fun! ✨
            </Badge>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-black mb-8 leading-tight">
              Where Little Minds Begin{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4C21A] via-[#FF6B9D] to-[#4CC9F0]">
                Big Adventures! 🌈
              </span>
            </h1>
            <p className="text-2xl sm:text-3xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
              Join the fun! Learn, play, and grow with exciting games and activities made just for you! 🎉
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="xl" 
                asChild 
                className="shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 text-xl py-8 px-12 rounded-2xl"
              >
                <Link to="/login">
                  🚀 Start Your Adventure!
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Link>
              </Button>
              <Button 
                size="xl" 
                variant="outline" 
                className="shadow-xl text-xl py-8 px-12 rounded-2xl border-4 border-[#F4C21A] hover:bg-[#FFF9E6] hover:scale-105 transition-all duration-300"
              >
                🎯 Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="text-6xl mb-6">🎯</div>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-black mb-6">
              Amazing Things You Can Do! 
            </h2>
            <p className="text-2xl text-gray-700 max-w-3xl mx-auto font-medium">
              Discover all the fun and exciting ways to learn and grow! 🎨✨
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className={`${feature.color} border-4 ${feature.borderColor} shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 hover:-rotate-1 animate-fade-in-up overflow-hidden group`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardHeader className="pb-8 pt-8">
                    <div className="flex items-start gap-6">
                      <div className={`relative w-24 h-24 ${feature.iconBg} rounded-3xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 shadow-xl`}>
                        <div className="text-4xl absolute -top-2 -right-2">{feature.emoji}</div>
                        <Icon className={`w-12 h-12 ${feature.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-3xl mb-4 font-black">{feature.title}</CardTitle>
                        <CardDescription className="text-lg text-gray-700 leading-relaxed font-medium">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-8 mt-24">
            <Card className="border-4 border-[#52B788] bg-gradient-to-br from-[#D5F5D5] to-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center pb-8">
                <div className="text-5xl mb-4">🔒</div>
                <CardTitle className="text-2xl">Safe & Secure</CardTitle>
                <CardDescription className="text-base text-gray-700 font-medium">
                  Your safety is super important to us! We keep everything protected and secure.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-4 border-[#4CC9F0] bg-gradient-to-br from-[#C7E9FB] to-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center pb-8">
                <div className="text-5xl mb-4">👨‍🏫</div>
                <CardTitle className="text-2xl">Amazing Teachers</CardTitle>
                <CardDescription className="text-base text-gray-700 font-medium">
                  Learn from the best teachers who love helping kids discover new things!
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-4 border-[#FF6B9D] bg-gradient-to-br from-[#FFD6E8] to-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center pb-8">
                <div className="text-5xl mb-4">⏰</div>
                <CardTitle className="text-2xl">Learn Anytime!</CardTitle>
                <CardDescription className="text-base text-gray-700 font-medium">
                  Study whenever you want! Morning, noon, or night - we're always here for you!
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#FFF9E6] via-[#FFE5B4] to-[#FFF9E6]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="text-6xl mb-6">💬</div>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-black mb-6">
              What People Are Saying! 
            </h2>
            <p className="text-2xl text-gray-700 font-medium">
              Hear from happy parents and amazing tutors! 💝
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="border-4 border-[#F4C21A] bg-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 hover:-rotate-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardHeader className="pb-8">
                  <div className="text-6xl mb-6 text-center">{testimonial.avatar}</div>
                  <div className="flex items-center justify-center gap-2 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-[#F4C21A] text-[#F4C21A]" />
                    ))}
                  </div>
                  <CardDescription className="text-gray-800 text-lg leading-relaxed mb-6 font-medium text-center">
                    "{testimonial.content}"
                  </CardDescription>
                  <div className="mt-6 text-center">
                    <CardTitle className="text-xl font-black">{testimonial.name}</CardTitle>
                    <CardDescription className="text-base font-semibold text-[#F4C21A]">{testimonial.role}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up space-y-8">
              <div className="text-6xl">🎓</div>
              <h2 className="text-5xl sm:text-6xl font-black text-black leading-tight">
                Learning Made Fun & Exciting! 
              </h2>
              <div className="space-y-6 text-xl text-gray-700 leading-relaxed font-medium">
                <p>
                  TinyLearn is your magical learning adventure! We bring together students, parents, and awesome teachers in a super fun way. Working with <strong>Level Up Learning Center</strong>, we create happy places where kids of all ages love to learn!
                </p>
                <p>
                  Our special platform has cool interactive lessons, fun educational games, progress tracking (so you can see how awesome you're doing!), and easy ways for parents and tutors to chat. We're here to help every student become a superstar! ⭐
                </p>
              </div>
              <div className="pt-6">
                <Button size="xl" asChild className="shadow-2xl hover:scale-110 transition-all duration-300 text-xl py-8 px-12 rounded-2xl">
                  <Link to="/login">
                    🚀 Join TinyLearn Today!
                    <ArrowRight className="ml-3 w-6 h-6" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <div className="absolute -inset-4 bg-gradient-to-r from-[#F4C21A] via-[#FF6B9D] to-[#4CC9F0] rounded-[3rem] transform rotate-6 opacity-30"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-[#FF6B9D] via-[#4CC9F0] to-[#F4C21A] rounded-[2.5rem] transform -rotate-3 opacity-40"></div>
              <img 
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=700&h=700&fit=crop"
                alt="Children learning"
                className="relative rounded-[2rem] shadow-2xl w-full h-auto object-cover border-8 border-white"
              />
              <div className="absolute -bottom-4 -right-4 text-8xl">🎨</div>
              <div className="absolute -top-4 -left-4 text-7xl">📖</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#FFD6E8] via-[#E3F2FD] to-[#D5F5D5]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="text-6xl mb-6">📞</div>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-black mb-6">
              Let's Get Started! 
            </h2>
            <p className="text-2xl text-gray-700 max-w-3xl mx-auto font-medium">
              Contact Level Up Learning Center and begin your amazing learning journey! 🎉
            </p>
          </div>

          <Card className="shadow-2xl border-8 border-white overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="bg-gradient-to-br from-[#F4C21A] to-[#FFD93D] p-12 text-black relative overflow-hidden">
                <div className="absolute top-10 right-10 text-6xl opacity-20">🎈</div>
                <div className="absolute bottom-10 left-10 text-5xl opacity-20">⭐</div>
                <div className="relative z-10">
                  <h3 className="text-4xl font-black mb-10">Level Up Learning Center</h3>
                  <div className="space-y-8">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-black/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl">
                        📍
                      </div>
                      <div>
                        <h4 className="text-2xl font-black mb-3">Where to Find Us</h4>
                        <p className="text-lg leading-relaxed">
                          Ground Floor #30 Canda St,<br />
                          Corner 18th St, East Bajac Bajac
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-black/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl">
                        ☎️
                      </div>
                      <div>
                        <h4 className="text-2xl font-black mb-3">Call Us</h4>
                        <p className="text-xl font-bold">(047) 222 5321</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-black/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl">
                        📧
                      </div>
                      <div>
                        <h4 className="text-2xl font-black mb-3">Email Us</h4>
                        <p className="text-lg">lulc2014@gmail.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-12 bg-white">
                <h3 className="text-3xl font-black text-black mb-8 flex items-center gap-3">
                  <span className="text-4xl">✉️</span> Send Us a Message!
                </h3>
                <form className="space-y-6">
                  <div>
                    <label className="block text-lg font-bold text-gray-700 mb-3">Your Name</label>
                    <input 
                      type="text" 
                      className="w-full px-6 py-4 rounded-2xl border-4 border-gray-300 focus:ring-4 focus:ring-[#F4C21A] focus:border-[#F4C21A] outline-none transition text-lg"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-bold text-gray-700 mb-3">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full px-6 py-4 rounded-2xl border-4 border-gray-300 focus:ring-4 focus:ring-[#F4C21A] focus:border-[#F4C21A] outline-none transition text-lg"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-bold text-gray-700 mb-3">Your Message</label>
                    <textarea 
                      rows="5" 
                      className="w-full px-6 py-4 rounded-2xl border-4 border-gray-300 focus:ring-4 focus:ring-[#F4C21A] focus:border-[#F4C21A] outline-none transition resize-none text-lg"
                      placeholder="Tell us how we can help you!"
                    ></textarea>
                  </div>
                  <Button size="xl" className="w-full text-xl py-8 rounded-2xl shadow-xl hover:scale-105 transition-all duration-300">
                    🚀 Send Message!
                  </Button>
                </form>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-10 left-20 text-5xl opacity-10">⭐</div>
        <div className="absolute bottom-10 right-20 text-5xl opacity-10">🌈</div>
        <div className="absolute top-20 right-40 text-4xl opacity-10">🎨</div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h4 className="text-2xl font-black mb-6 text-[#F4C21A] flex items-center gap-2">
                <span className="text-3xl">🎓</span> TinyLearn
              </h4>
              <p className="text-gray-300 text-base leading-relaxed">
                Making learning fun and exciting for every child! Join us on this amazing adventure! 🚀
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-6 text-[#F4C21A]">Quick Links</h4>
              <ul className="space-y-3 text-base">
                <li><a href="#home" className="text-gray-300 hover:text-[#F4C21A] transition flex items-center gap-2">🏠 Home</a></li>
                <li><a href="#features" className="text-gray-300 hover:text-[#F4C21A] transition flex items-center gap-2">✨ Features</a></li>
                <li><a href="#about" className="text-gray-300 hover:text-[#F4C21A] transition flex items-center gap-2">📖 About</a></li>
                <li><a href="#contact" className="text-gray-300 hover:text-[#F4C21A] transition flex items-center gap-2">📞 Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-6 text-[#F4C21A]">Resources</h4>
              <ul className="space-y-3 text-base">
                <li><Link to="/login" className="text-gray-300 hover:text-[#F4C21A] transition flex items-center gap-2">🔐 Login</Link></li>
                <li><a href="#" className="text-gray-300 hover:text-[#F4C21A] transition flex items-center gap-2">💡 Support</a></li>
                <li><a href="#" className="text-gray-300 hover:text-[#F4C21A] transition flex items-center gap-2">🔒 Privacy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-[#F4C21A] transition flex items-center gap-2">📜 Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-6 text-[#F4C21A]">Connect With Us</h4>
              <div className="flex gap-4">
                <a href="#" className="w-14 h-14 bg-gradient-to-br from-[#F4C21A] to-[#FFD93D] hover:scale-110 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg text-2xl">
                  📘
                </a>
                <a href="#" className="w-14 h-14 bg-gradient-to-br from-[#4CC9F0] to-[#4361EE] hover:scale-110 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg text-2xl">
                  🐦
                </a>
                <a href="#" className="w-14 h-14 bg-gradient-to-br from-[#FF6B9D] to-[#F72585] hover:scale-110 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg text-2xl">
                  📺
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-10 text-center">
            <p className="text-gray-400 text-lg">
              © 2025 TinyLearn. All rights reserved. Made with ❤️ by Level Up Learning Center.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
