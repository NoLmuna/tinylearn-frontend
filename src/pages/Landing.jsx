import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  BookOpen,
  TrendingUp,
  MessageCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Star,
  Heart,
  Smile,
  Zap,
  Gift,
  ArrowUp,
} from "lucide-react";

export default function Landing() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const features = [
    {
      icon: BookOpen,
      title: "Interactive Lessons",
      description:
        "Fun and colorful lessons that make learning feel like an amazing adventure!",
      color: "bg-gradient-to-br from-[#FFE5B4] via-[#FFF9E6] to-[#FFEAA7]",
      iconBg: "bg-gradient-to-br from-[#F4C21A] to-[#FFD93D]",
      iconColor: "text-black",
      borderColor: "border-[#F4C21A]",
    },
    {
      icon: CheckCircle2,
      title: "Exciting Quests",
      description:
        "Complete fun assignments and quizzes to level up your knowledge!",
      color: "bg-gradient-to-br from-[#FFD6E8] via-[#FFE6F0] to-[#FFC8DD]",
      iconBg: "bg-gradient-to-br from-[#FF6B9D] to-[#F72585]",
      iconColor: "text-white",
      borderColor: "border-[#FF6B9D]",
    },
    {
      icon: TrendingUp,
      title: "Track Your Progress",
      description: "Watch yourself grow and collect awesome achievements!",
      color: "bg-gradient-to-br from-[#C7E9FB] via-[#E3F2FD] to-[#A2D2FF]",
      iconBg: "bg-gradient-to-br from-[#4CC9F0] to-[#4361EE]",
      iconColor: "text-white",
      borderColor: "border-[#4CC9F0]",
    },
    {
      icon: MessageCircle,
      title: "Stay Connected",
      description:
        "Parents and tutors can chat and share your amazing progress!",
      color: "bg-gradient-to-br from-[#D5F5D5] via-[#E8F5E9] to-[#B7E4C7]",
      iconBg: "bg-gradient-to-br from-[#52B788] to-[#2D6A4F]",
      iconColor: "text-white",
      borderColor: "border-[#52B788]",
    },
  ];

  const testimonials = [
    {
      name: "Maria Santos",
      role: "Parent",
      content:
        "TinyLearn has transformed my child's learning experience. The interactive lessons keep them engaged and excited to learn every day!",
      rating: 5,
      avatar: <Smile className="w-12 h-12 text-[#F4C21A]" />,
    },
    {
      name: "John Reyes",
      role: "Tutor",
      content:
        "As an educator, I appreciate the comprehensive tools TinyLearn provides. It makes tracking student progress incredibly easy.",
      rating: 5,
      avatar: <BookOpen className="w-12 h-12 text-[#4CC9F0]" />,
    },
    {
      name: "Linda Cruz",
      role: "Parent",
      content:
        "The communication features are fantastic! I can stay connected with my child's tutor and monitor their progress in real-time.",
      rating: 5,
      avatar: <Heart className="w-12 h-12 text-[#FF6B9D]" />,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9E6] via-[#F9F9F9] to-[#FFF0F5] overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section
        id="home"
        className="pt-32 pb-40 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        {/* Animated Background Blobs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-[#FFE5B4] rounded-full mix-blend-multiply filter blur-3xl opacity-70"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-40 -right-20 w-[30rem] h-[30rem] bg-[#FFD6E8] rounded-full mix-blend-multiply filter blur-3xl opacity-70"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], x: [0, 50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 left-1/3 w-80 h-80 bg-[#C7E9FB] rounded-full mix-blend-multiply filter blur-3xl opacity-60"
        />

        {/* Playful scattered icons */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 opacity-30"
        >
          <Star className="w-16 h-16 text-[#F4C21A]" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-20 opacity-30"
        >
          <Sparkles className="w-14 h-14 text-[#FF6B9D]" />
        </motion.div>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-1/4 opacity-30"
        >
          <Zap className="w-12 h-12 text-[#4CC9F0]" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-60 right-10 opacity-30"
        >
          <Gift className="w-14 h-14 text-[#52B788]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="max-w-7xl mx-auto relative z-10 text-center"
        >
          <Badge className="mb-8 text-base py-3 px-6 shadow-lg hover:scale-105 transition-transform cursor-default">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5 mr-2 inline text-yellow-300" />
            </motion.div>
            Let's Make Learning Fun!
          </Badge>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-slate-800 mb-8 leading-tight">
            Where Little Minds Begin{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4C21A] via-[#FF6B9D] to-[#4CC9F0]">
              Big Adventures!
            </span>
          </h1>

          <p className="text-2xl sm:text-3xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
            Join the fun! Learn and grow with exciting interactive lessons and
            engaging quests made just for you!
          </p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          >
            <Button
              size="xl"
              asChild
              className="shadow-2xl hover:shadow-[#F4C21A]/50 hover:scale-110 transition-all duration-300 text-xl py-8 px-12 rounded-3xl group relative overflow-hidden"
            >
              <Link to="/login">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#F4C21A] via-[#FF6B9D] to-[#4CC9F0] opacity-80 group-hover:opacity-100 transition-opacity"></span>
                <span className="relative flex items-center text-white">
                  <Zap className="mr-3 w-6 h-6 group-hover:animate-pulse" />
                  Start Your Adventure!
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity }}
                  >
                    <ArrowRight className="ml-3 w-6 h-6" />
                  </motion.div>
                </span>
              </Link>
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="shadow-xl text-xl py-8 px-12 rounded-3xl border-4 border-[#4CC9F0] text-[#4CC9F0] hover:bg-[#C7E9FB] hover:scale-105 transition-all duration-300 group"
            >
              <BookOpen className="mr-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* SVG Wave Divider */}
      <div className="absolute left-0 right-0 w-full overflow-hidden leading-none z-0 transform -translate-y-1">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-16 sm:h-24 lg:h-32 text-white fill-current block"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      {/* Features Section */}
      <section
        id="features"
        className="py-32 px-4 sm:px-6 lg:px-8 bg-white relative"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-24"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="flex justify-center mb-6"
            >
              <Star className="w-16 h-16 text-[#F4C21A]" />
            </motion.div>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-800 mb-6">
              Amazing Things You Can Do!
            </h2>
            <p className="text-2xl text-slate-600 max-w-3xl mx-auto font-medium">
              Discover all the fun and exciting ways to learn and grow!
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-2 gap-10 mb-20"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div key={index} variants={itemVariants}>
                  <Card
                    className={`${feature.color} border-4 ${feature.borderColor} shadow-xl hover:shadow-3xl transition-all duration-300 overflow-hidden group cursor-pointer h-full`}
                  >
                    <motion.div whileHover={{ scale: 1.02, rotate: -1 }}>
                      <CardHeader className="p-8">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                          <div
                            className={`relative w-24 h-24 ${feature.iconBg} rounded-[2rem] flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-xl`}
                          >
                            <Icon
                              className={`w-12 h-12 ${feature.iconColor}`}
                            />
                          </div>
                          <div className="flex-1 mt-4 sm:mt-0">
                            <CardTitle className="text-3xl mb-3 font-black text-slate-800 group-hover:text-black transition-colors">
                              {feature.title}
                            </CardTitle>
                            <CardDescription className="text-lg text-slate-700 leading-relaxed font-medium">
                              {feature.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </motion.div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-3 gap-8 mt-24"
          >
            <motion.div variants={itemVariants} whileHover={{ y: -10 }}>
              <Card className="border-4 border-[#52B788] bg-gradient-to-br from-[#D5F5D5] to-white shadow-xl h-full">
                <CardHeader className="text-center p-8">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-[#52B788]/20 rounded-full">
                      <CheckCircle2 className="w-12 h-12 text-[#52B788]" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-black text-slate-800">
                    Safe & Secure
                  </CardTitle>
                  <CardDescription className="text-base text-slate-600 font-medium mt-3">
                    Your safety is super important to us! We keep everything
                    protected and secure.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ y: -10 }}>
              <Card className="border-4 border-[#4CC9F0] bg-gradient-to-br from-[#C7E9FB] to-white shadow-xl h-full">
                <CardHeader className="text-center p-8">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-[#4CC9F0]/20 rounded-full">
                      <BookOpen className="w-12 h-12 text-[#4CC9F0]" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-black text-slate-800">
                    Amazing Teachers
                  </CardTitle>
                  <CardDescription className="text-base text-slate-600 font-medium mt-3">
                    Learn from the best teachers who love helping kids discover
                    new things!
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ y: -10 }}>
              <Card className="border-4 border-[#FF6B9D] bg-gradient-to-br from-[#FFD6E8] to-white shadow-xl h-full">
                <CardHeader className="text-center p-8">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-[#FF6B9D]/20 rounded-full">
                      <Zap className="w-12 h-12 text-[#FF6B9D]" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-black text-slate-800">
                    Learn Anytime!
                  </CardTitle>
                  <CardDescription className="text-base text-slate-600 font-medium mt-3">
                    Study whenever you want! Morning, noon, or night - we're
                    always here for you!
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bottom Wave Divider */}
      <div className="absolute left-0 right-0 w-full overflow-hidden leading-none z-10 transform scale-y-[-1] mt-[-1px]">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-16 sm:h-24 lg:h-32 text-white fill-current block"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      {/* Testimonials Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#FFF9E6] via-[#FFE5B4] to-[#FFF9E6] relative">
        <div className="max-w-7xl mx-auto mt-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex justify-center mb-6"
            >
              <MessageCircle className="w-16 h-16 text-[#F4C21A]" />
            </motion.div>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-800 mb-6">
              What People Are Saying!
            </h2>
            <p className="text-xl text-slate-700 font-medium">
              Hear from happy parents and amazing tutors!
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid lg:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="border-4 border-white hover:border-[#F4C21A] bg-white/80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col group">
                  <CardHeader className="p-8 flex-1 flex flex-col">
                    <div className="flex justify-center mb-6 transform group-hover:scale-110 transition-transform">
                      {testimonial.avatar}
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-[#F4C21A] text-[#F4C21A]"
                        />
                      ))}
                    </div>
                    <CardDescription className="text-slate-700 text-lg leading-relaxed mb-6 font-medium text-center italic flex-1">
                      "{testimonial.content}"
                    </CardDescription>
                    <div className="mt-auto text-center pt-6 border-t-2 border-slate-100">
                      <CardTitle className="text-xl font-black text-slate-800">
                        {testimonial.name}
                      </CardTitle>
                      <CardDescription className="text-base font-bold text-[#F4C21A] mt-1">
                        {testimonial.role}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-32 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
              className="space-y-8"
            >
              <div className="flex mb-6">
                <div className="p-4 bg-blue-50 rounded-2xl">
                  <BookOpen className="w-12 h-12 text-[#4CC9F0]" />
                </div>
              </div>
              <h2 className="text-5xl sm:text-6xl font-black text-slate-800 leading-tight">
                Learning Made Fun & Exciting!
              </h2>
              <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-medium">
                <p>
                  TinyLearn is your magical learning adventure! We bring
                  together students, parents, and awesome teachers in a super
                  fun way. Working with{" "}
                  <strong className="text-[#FF6B9D]">
                    Level Up Learning Center
                  </strong>
                  , we create happy places where kids of all ages love to learn!
                </p>
                <p>
                  Our special platform has cool interactive lessons, rewarding
                  quests, progress tracking (so you can see how awesome you're
                  doing!), and easy ways for parents and tutors to chat. We're
                  here to help every student become a superstar!
                </p>
              </div>
              <div className="pt-6">
                <Button
                  size="xl"
                  asChild
                  className="shadow-xl bg-[#4CC9F0] hover:bg-[#4CC9F0]/90 hover:-translate-y-2 transition-all duration-300 text-xl py-8 px-12 rounded-3xl"
                >
                  <Link to="/login">
                    <Zap className="mr-3 w-6 h-6 animate-pulse" />
                    Join TinyLearn Today!
                    <ArrowRight className="ml-3 w-6 h-6" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative"
            >
              <motion.div
                animate={{ rotate: [6, 10, 6] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -inset-4 bg-gradient-to-r from-[#F4C21A] via-[#FF6B9D] to-[#4CC9F0] rounded-[3rem] opacity-30"
              ></motion.div>
              <motion.div
                animate={{ rotate: [-3, -6, -3] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -inset-2 bg-gradient-to-r from-[#FF6B9D] via-[#4CC9F0] to-[#F4C21A] rounded-[2.5rem] opacity-40"
              ></motion.div>

              <div className="relative rounded-[2rem] shadow-2xl w-full h-[30rem] bg-gradient-to-br from-white to-blue-50 flex items-center justify-center border-8 border-white overflow-hidden">
                <motion.div
                  animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 8, repeat: Infinity }}
                >
                  <BookOpen className="w-40 h-40 text-[#4CC9F0]/50" />
                </motion.div>
              </div>

              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-8 -right-8 bg-white p-6 rounded-full shadow-2xl border-4 border-[#FFD6E8]"
              >
                <Sparkles className="w-14 h-14 text-[#FF6B9D]" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -top-8 -left-8 bg-white p-6 rounded-full shadow-2xl border-4 border-[#C7E9FB]"
              >
                <BookOpen className="w-14 h-14 text-[#4CC9F0]" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SVG Wave Divider before Footer */}
      <div className="absolute left-0 right-0 w-full overflow-hidden leading-none z-0 transform -translate-y-1">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-16 sm:h-24 lg:h-32 text-[#FFD6E8] fill-current block"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-4 sm:px-6 lg:px-8 bg-[#FFD6E8]">
        <div className="max-w-7xl mx-auto mt-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex justify-center mb-6">
              <MessageCircle className="w-16 h-16 text-[#FF6B9D]" />
            </div>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-800 mb-6">
              Let's Get Started!
            </h2>
            <p className="text-2xl text-slate-700 max-w-3xl mx-auto font-medium">
              Contact Level Up Learning Center and begin your amazing learning
              journey!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-2xl border-8 border-white overflow-hidden rounded-[2rem]">
              <div className="grid lg:grid-cols-2">
                <div className="bg-gradient-to-br from-[#F4C21A] to-[#FFD93D] p-12 text-black relative overflow-hidden">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute -top-10 -right-10 opacity-20"
                  >
                    <Gift className="w-48 h-48 text-black" />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute bottom-10 left-10 opacity-20"
                  >
                    <Star className="w-32 h-32 text-black" />
                  </motion.div>

                  <div className="relative z-10 h-full flex flex-col justify-center">
                    <h3 className="text-4xl font-black mb-10 leading-tight">
                      Level Up Learning Center
                    </h3>
                    <div className="space-y-8">
                      <motion.div
                        whileHover={{ x: 10 }}
                        className="flex items-start gap-6 cursor-pointer"
                      >
                        <div className="w-16 h-16 bg-white/30 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm shadow-sm">
                          <BookOpen className="w-8 h-8 text-black" />
                        </div>
                        <div>
                          <h4 className="text-2xl font-black mb-2">
                            Where to Find Us
                          </h4>
                          <p className="text-lg leading-relaxed font-medium">
                            Ground Floor #30 Canda St,
                            <br />
                            Corner 18th St, East Bajac Bajac
                          </p>
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ x: 10 }}
                        className="flex items-start gap-6 cursor-pointer"
                      >
                        <div className="w-16 h-16 bg-white/30 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm shadow-sm">
                          <MessageCircle className="w-8 h-8 text-black" />
                        </div>
                        <div>
                          <h4 className="text-2xl font-black mb-2">Call Us</h4>
                          <p className="text-xl font-bold">(047) 222 5321</p>
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ x: 10 }}
                        className="flex items-start gap-6 cursor-pointer"
                      >
                        <div className="w-16 h-16 bg-white/30 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm shadow-sm">
                          <Zap className="w-8 h-8 text-black" />
                        </div>
                        <div>
                          <h4 className="text-2xl font-black mb-2">Email Us</h4>
                          <p className="text-lg font-bold">
                            lulc2014@gmail.com
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                <div className="p-12 bg-white flex flex-col justify-center">
                  <h3 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3">
                    <MessageCircle className="w-10 h-10 text-[#4CC9F0]" /> Send
                    Us a Message!
                  </h3>
                  <form className="space-y-6">
                    <div>
                      <label className="block text-lg font-bold text-slate-700 mb-3">
                        Your Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-6 py-4 rounded-2xl border-4 border-slate-100 bg-slate-50 focus:bg-white focus:ring-0 focus:border-[#F4C21A] outline-none transition-all text-lg font-medium shadow-inner"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-bold text-slate-700 mb-3">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="w-full px-6 py-4 rounded-2xl border-4 border-slate-100 bg-slate-50 focus:bg-white focus:ring-0 focus:border-[#F4C21A] outline-none transition-all text-lg font-medium shadow-inner"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-bold text-slate-700 mb-3">
                        Your Message
                      </label>
                      <textarea
                        rows="4"
                        className="w-full px-6 py-4 rounded-2xl border-4 border-slate-100 bg-slate-50 focus:bg-white focus:ring-0 focus:border-[#F4C21A] outline-none transition-all resize-none text-lg font-medium shadow-inner"
                        placeholder="Tell us how we can help you!"
                      ></textarea>
                    </div>
                    <Button
                      size="xl"
                      type="button"
                      className="w-full text-xl py-8 rounded-2xl shadow-xl hover:scale-[1.02] bg-[#FF6B9D] hover:bg-[#F72585] text-white transition-all duration-300"
                    >
                      <Zap className="mr-3 w-6 h-6 animate-bounce" /> Send
                      Message!
                    </Button>
                  </form>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-10 left-20 opacity-5">
          <Star className="w-24 h-24 text-white" />
        </div>
        <div className="absolute bottom-10 right-20 opacity-5">
          <Heart className="w-32 h-32 text-white" />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.02]">
          <BookOpen className="w-96 h-96 text-white" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-[#F4C21A] to-[#FFD93D] rounded-xl">
                  <Star className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-3xl font-black">
                  Tiny<span className="text-[#F4C21A]">Learn</span>
                </h3>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">
                Making learning an amazing adventure every single day! Joined
                with Level Up Learning Center.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-6 text-[#4CC9F0]">
                Quick Links
              </h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#home"
                    className="text-slate-300 hover:text-white hover:translate-x-2 transition-all flex items-center gap-2 font-medium"
                  >
                    <ArrowRight className="w-4 h-4 text-[#4CC9F0]" /> Home
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-slate-300 hover:text-white hover:translate-x-2 transition-all flex items-center gap-2 font-medium"
                  >
                    <ArrowRight className="w-4 h-4 text-[#4CC9F0]" /> Features
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="text-slate-300 hover:text-white hover:translate-x-2 transition-all flex items-center gap-2 font-medium"
                  >
                    <ArrowRight className="w-4 h-4 text-[#4CC9F0]" /> About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-slate-300 hover:text-white hover:translate-x-2 transition-all flex items-center gap-2 font-medium"
                  >
                    <ArrowRight className="w-4 h-4 text-[#4CC9F0]" /> Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-6 text-[#FF6B9D]">
                Connect With Us
              </h4>
              <div className="flex gap-4">
                <motion.a
                  whileHover={{ y: -5, rotate: -10 }}
                  href="#"
                  className="w-14 h-14 bg-gradient-to-br from-[#F4C21A] to-[#FFD93D] rounded-2xl flex items-center justify-center transition-all shadow-lg"
                >
                  <BookOpen className="w-6 h-6 text-black" />
                </motion.a>
                <motion.a
                  whileHover={{ y: -5, rotate: 10 }}
                  href="#"
                  className="w-14 h-14 bg-gradient-to-br from-[#4CC9F0] to-[#4361EE] rounded-2xl flex items-center justify-center transition-all shadow-lg"
                >
                  <MessageCircle className="w-6 h-6 text-white" />
                </motion.a>
                <motion.a
                  whileHover={{ y: -5, rotate: -10 }}
                  href="#"
                  className="w-14 h-14 bg-gradient-to-br from-[#FF6B9D] to-[#F72585] rounded-2xl flex items-center justify-center transition-all shadow-lg"
                >
                  <Zap className="w-6 h-6 text-white" />
                </motion.a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-10 text-center">
            <p className="text-slate-400 text-lg font-medium">
              © 2026 TinyLearn. All rights reserved. Made with{" "}
              <Heart className="w-5 h-5 inline text-[#FF6B9D] animate-pulse mx-1" />{" "}
              by Level Up Learning Center.
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: showScrollTop ? 1 : 0, 
          scale: showScrollTop ? 1 : 0.5,
          pointerEvents: showScrollTop ? "auto" : "none" 
        }}
        whileHover={{ y: -5, scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-br from-[#F4C21A] to-[#FFD93D] rounded-2xl flex items-center justify-center shadow-2xl text-black border-4 border-white cursor-pointer"
      >
        <ArrowUp className="w-8 h-8 font-black" />
      </motion.button>
    </div>
  );
}