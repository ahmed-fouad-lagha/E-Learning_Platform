'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, BookOpen, Users, Trophy, Globe, Smartphone, Wifi, GraduationCap, Star, Play, CheckCircle, BarChart3, Heart, Brain, Target, Clock, Award, TrendingUp, MessageCircle, Download, Shield, Zap, Calendar, MapPin, Phone, Mail, ChevronDown, Menu, X, Search, Filter, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const [language, setLanguage] = useState('ar');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAuthClick = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/auth');
    }
  };

  const content = {
    ar: {
      nav: {
        courses: 'الدروس',
        exams: 'الامتحانات',
        dashboard: 'لوحة التحكم',
        pricing: 'الأسعار',
        about: 'عن المنصة',
        contact: 'اتصل بنا',
        login: user ? 'لوحة التحكم' : 'تسجيل الدخول',
        signup: 'إنشاء حساب'
      },
      hero: {
        title: 'منصة التعلم الإلكتروني الجزائرية',
        subtitle: 'استعد لامتحان البكالوريا مع أفضل منصة تعليمية مصممة خصيصاً للطلاب الجزائريين',
        description: 'محتوى تعليمي متوافق مع منهاج الديوان الوطني للامتحانات والمسابقات، مع إمكانية الوصول دون اتصال بالإنترنت',
        cta: 'ابدأ رحلتك التعليمية',
        watchDemo: 'شاهد العرض التوضيحي',
        freeTrial: 'جرب مجاناً لمدة 7 أيام'
      },
      stats: {
        students: '50,000+ طالب',
        courses: '500+ درس',
        success: '95% معدل النجاح',
        teachers: '200+ أستاذ',
        hours: '100,000+ ساعة تعلم',
        downloads: '1M+ تحميل'
      },
      features: {
        title: 'لماذا اختيار منصتنا؟',
        subtitle: 'نقدم لك أحدث التقنيات التعليمية لضمان نجاحك في البكالوريا',
        adaptive: {
          title: 'تعلم تكيفي ذكي',
          description: 'نظام ذكي يتكيف مع مستواك ويقترح المحتوى المناسب لك باستخدام الذكاء الاصطناعي'
        },
        curriculum: {
          title: 'منهاج معتمد رسمياً',
          description: 'محتوى متوافق 100% مع منهاج الديوان الوطني للامتحانات والمسابقات'
        },
        offline: {
          title: 'التعلم دون انترنت',
          description: 'حمل الدروس واستمر في التعلم حتى بدون اتصال بالإنترنت في أي مكان'
        },
        multilingual: {
          title: 'متعدد اللغات',
          description: 'محتوى باللغات العربية والفرنسية والإنجليزية مع ترجمة فورية'
        },
        mobile: {
          title: 'محسن للهواتف',
          description: 'تجربة مثالية على جميع الأجهزة المحمولة مع تطبيق أندرويد مخصص'
        },
        simulation: {
          title: 'محاكي البكالوريا',
          description: 'امتحانات تجريبية تحاكي امتحان البكالوريا الحقيقي مع تصحيح فوري'
        },
        analytics: {
          title: 'تحليلات متقدمة',
          description: 'تتبع تقدمك وحدد نقاط القوة والضعف مع توصيات شخصية'
        },
        community: {
          title: 'مجتمع تعليمي',
          description: 'انضم لمجموعات الدراسة وتفاعل مع الطلاب والأساتذة'
        }
      },
      subjects: {
        title: 'المواد الدراسية',
        description: 'جميع مواد البكالوريا متوفرة مع محتوى تفاعلي ومتطور',
        viewAll: 'عرض جميع المواد',
        math: 'الرياضيات',
        physics: 'الفيزياء',
        chemistry: 'الكيمياء',
        biology: 'علوم الطبيعة والحياة',
        literature: 'اللغة العربية وآدابها',
        french: 'اللغة الفرنسية',
        english: 'اللغة الإنجليزية',
        philosophy: 'الفلسفة',
        history: 'التاريخ والجغرافيا',
        islamic: 'التربية الإسلامية',
        civics: 'التربية المدنية'
      },
      testimonials: {
        title: 'قصص النجاح',
        subtitle: 'ماذا يقول طلابنا الناجحون',
        student1: {
          name: 'فاطمة بن عمر',
          school: 'ثانوية الأمير عبد القادر - الجزائر',
          testimonial: 'بفضل هذه المنصة تمكنت من تحسين علاماتي في الرياضيات من 12 إلى 18. المحتوى ممتاز والشرح واضح جداً. النظام التكيفي ساعدني في التركيز على نقاط ضعفي.',
          grade: 'بكالوريا 2024 - علوم تجريبية',
          score: '18.25'
        },
        student2: {
          name: 'أحمد زروالي',
          school: 'ثانوية ابن خلدون - وهران',
          testimonial: 'امتحانات المحاكاة ساعدتني كثيراً في التحضير للبكالوريا. الأسئلة مشابهة جداً للامتحان الحقيقي. حصلت على معدل ممتاز بفضل التحضير المكثف.',
          grade: 'بكالوريا 2024 - آداب وفلسفة',
          score: '16.85'
        },
        student3: {
          name: 'مريم بوعلام',
          school: 'ثانوية الشهيد مالك حداد - قسنطينة',
          testimonial: 'إمكانية التعلم دون انترنت مفيدة جداً خاصة في المناطق النائية. تمكنت من متابعة دروسي في كل مكان. المجتمع التعليمي رائع للمساعدة.',
          grade: 'بكالوريا 2024 - رياضيات',
          score: '17.50'
        }
      },
      newsletter: {
        title: 'ابق على اطلاع دائم',
        subtitle: 'احصل على آخر الأخبار والنصائح التعليمية والتحديثات مباشرة في بريدك الإلكتروني',
        placeholder: 'أدخل بريدك الإلكتروني',
        subscribe: 'اشترك الآن',
        benefits: [
          'نصائح أسبوعية للدراسة',
          'تحديثات المنهاج الجديدة',
          'مواعيد الامتحانات المهمة',
          'عروض خاصة للطلاب'
        ]
      },
      pricing: {
        title: 'خطط الاشتراك',
        subtitle: 'اختر الخطة المناسبة لك',
        free: {
          title: 'مجاني',
          price: '0 دج',
          period: 'شهرياً',
          features: [
            'الوصول لـ 10 دروس',
            'امتحان تجريبي واحد',
            'دعم المجتمع',
            'تطبيق الهاتف'
          ]
        },
        premium: {
          title: 'مميز',
          price: '2,500 دج',
          period: 'شهرياً',
          popular: true,
          features: [
            'الوصول لجميع الدروس',
            'امتحانات تجريبية لا محدودة',
            'تحليلات متقدمة',
            'دعم فني 24/7',
            'تحميل للاستخدام دون انترنت',
            'مجموعات دراسة خاصة'
          ]
        },
        school: {
          title: 'المدارس',
          price: 'حسب الطلب',
          period: 'سنوياً',
          features: [
            'حسابات لا محدودة',
            'لوحة تحكم المعلمين',
            'تقارير مفصلة',
            'تدريب المعلمين',
            'دعم تقني مخصص',
            'تخصيص المحتوى'
          ]
        }
      },
      cta: {
        title: 'ابدأ رحلتك نحو النجاح اليوم',
        description: 'انضم إلى آلاف الطلاب الذين حققوا النجاح معنا في امتحان البكالوريا',
        button: 'انضم إلينا مجاناً',
        guarantee: 'ضمان استرداد المال خلال 30 يوم'
      },
      footer: {
        description: 'منصة التعلم الإلكتروني الرائدة في الجزائر، مصممة خصيصاً لمساعدة الطلاب في تحقيق النجاح في امتحان البكالوريا.',
        quickLinks: 'روابط سريعة',
        subjects: 'المواد',
        support: 'الدعم',
        legal: 'قانوني',
        contact: 'تواصل معنا',
        rights: 'جميع الحقوق محفوظة',
        madeWith: 'صُنع بحب للطلاب الجزائريين'
      }
    },
    fr: {
      nav: {
        courses: 'Cours',
        exams: 'Examens',
        dashboard: 'Tableau de bord',
        pricing: 'Tarifs',
        about: 'À propos',
        contact: 'Contact',
        login: user ? 'Tableau de bord' : 'Connexion',
        signup: 'Inscription'
      },
      hero: {
        title: 'Plateforme E-Learning Algérienne',
        subtitle: 'Préparez votre BAC avec la meilleure plateforme éducative conçue pour les étudiants algériens',
        description: 'Contenu éducatif aligné sur le programme ONEC avec accès hors ligne',
        cta: 'Commencer votre parcours',
        watchDemo: 'Voir la démo',
        freeTrial: 'Essai gratuit 7 jours'
      },
      stats: {
        students: '50 000+ étudiants',
        courses: '500+ cours',
        success: '95% de réussite',
        teachers: '200+ professeurs',
        hours: '100 000+ heures',
        downloads: '1M+ téléchargements'
      },
      features: {
        title: 'Pourquoi choisir notre plateforme?',
        subtitle: 'Nous offrons les dernières technologies éducatives pour garantir votre réussite au BAC',
        adaptive: {
          title: 'Apprentissage adaptatif',
          description: 'Système intelligent qui s\'adapte à votre niveau avec IA'
        },
        curriculum: {
          title: 'Programme officiel',
          description: 'Contenu 100% conforme au programme ONEC'
        },
        offline: {
          title: 'Mode hors ligne',
          description: 'Téléchargez et étudiez sans connexion internet'
        },
        multilingual: {
          title: 'Multilingue',
          description: 'Contenu en arabe, français et anglais'
        },
        mobile: {
          title: 'Optimisé mobile',
          description: 'Expérience parfaite sur tous les appareils'
        },
        simulation: {
          title: 'Simulateur BAC',
          description: 'Examens blancs qui simulent le vrai BAC'
        },
        analytics: {
          title: 'Analyses avancées',
          description: 'Suivez vos progrès avec des recommandations'
        },
        community: {
          title: 'Communauté',
          description: 'Rejoignez des groupes d\'étude et interagissez'
        }
      },
      subjects: {
        title: 'Matières d\'étude',
        description: 'Toutes les matières du BAC disponibles avec du contenu interactif et avancé',
        viewAll: 'Voir toutes les matières',
        math: 'Mathématiques',
        physics: 'Physique',
        chemistry: 'Chimie',
        biology: 'Sciences de la nature et de la vie',
        literature: 'Langue et littérature arabes',
        french: 'Langue française',
        english: 'Langue anglaise',
        philosophy: 'Philosophie',
        history: 'Histoire et géographie',
        islamic: 'Éducation islamique',
        civics: 'Éducation civique'
      },
      testimonials: {
        title: 'Histoires de réussite',
        subtitle: 'Ce que disent nos étudiants qui ont réussi',
        student1: {
          name: 'Fatima Ben Omar',
          school: 'Lycée Emir Abdelkader - Alger',
          testimonial: 'Grâce à cette plateforme, j\'ai pu améliorer mes notes en mathématiques de 12 à 18. Le contenu est excellent et les explications très claires. Le système adaptatif m\'a aidée à me concentrer sur mes points faibles.',
          grade: 'BAC 2024 - Sciences expérimentales',
          score: '18.25'
        },
        student2: {
          name: 'Ahmed Zeroual',
          school: 'Lycée Ibn Khaldoun - Oran',
          testimonial: 'Les examens de simulation m\'ont beaucoup aidé à me préparer pour le BAC. Les questions sont très similaires au vrai examen. J\'ai obtenu une excellente moyenne grâce à cette préparation intensive.',
          grade: 'BAC 2024 - Lettres et philosophie',
          score: '16.85'
        },
        student3: {
          name: 'Meriem Boualam',
          school: 'Lycée Chahid Malek Haddad - Constantine',
          testimonial: 'La possibilité d\'apprendre hors ligne est très utile, surtout dans les zones rurales. J\'ai pu suivre mes cours partout. La communauté éducative est formidable pour l\'aide.',
          grade: 'BAC 2024 - Mathématiques',
          score: '17.50'
        }
      },
      newsletter: {
        title: 'Restez informé',
        subtitle: 'Recevez les dernières nouvelles et conseils éducatifs directement dans votre boîte mail',
        placeholder: 'Entrez votre email',
        subscribe: 'S\'abonner',
        benefits: [
          'Conseils d\'étude hebdomadaires',
          'Mises à jour du programme',
          'Dates d\'examens importantes',
          'Offres spéciales étudiants'
        ]
      },
      pricing: {
        title: 'Plans d\'abonnement',
        subtitle: 'Choisissez le plan qui vous convient',
        free: {
          title: 'Gratuit',
          price: '0 DA',
          period: 'par mois',
          features: [
            'Accès à 10 cours',
            'Un examen blanc',
            'Support communautaire',
            'Application mobile'
          ]
        },
        premium: {
          title: 'Premium',
          price: '2 500 DA',
          period: 'par mois',
          popular: true,
          features: [
            'Accès à tous les cours',
            'Examens blancs illimités',
            'Analyses avancées',
            'Support technique 24/7',
            'Téléchargement hors ligne',
            'Groupes d\'étude privés'
          ]
        },
        school: {
          title: 'Écoles',
          price: 'Sur devis',
          period: 'par an',
          features: [
            'Comptes illimités',
            'Tableau de bord enseignants',
            'Rapports détaillés',
            'Formation des enseignants',
            'Support technique dédié',
            'Personnalisation du contenu'
          ]
        }
      },
      cta: {
        title: 'Commencez votre parcours vers le succès aujourd\'hui',
        description: 'Rejoignez des milliers d\'étudiants qui ont réussi avec nous au BAC',
        button: 'Rejoignez-nous gratuitement',
        guarantee: 'Garantie de remboursement sous 30 jours'
      },
      footer: {
        description: 'La plateforme d\'apprentissage en ligne leader en Algérie, spécialement conçue pour aider les étudiants à réussir l\'examen du baccalauréat.',
        quickLinks: 'Liens rapides',
        subjects: 'Matières',
        support: 'Support',
        legal: 'Légal',
        contact: 'Contactez-nous',
        rights: 'Tous droits réservés',
        madeWith: 'Fait avec amour pour les étudiants algériens'
      }
    }
  };

  const currentContent = content[language as keyof typeof content];

  const subjectData = [
    { name: currentContent.subjects.math, icon: '📊', color: 'bg-blue-500', lessons: 45, progress: 78, difficulty: 'Avancé' },
    { name: currentContent.subjects.physics, icon: '⚛️', color: 'bg-purple-500', lessons: 38, progress: 65, difficulty: 'Avancé' },
    { name: currentContent.subjects.chemistry, icon: '🧪', color: 'bg-green-500', lessons: 32, progress: 82, difficulty: 'Intermédiaire' },
    { name: currentContent.subjects.biology, icon: '🔬', color: 'bg-emerald-500', lessons: 40, progress: 71, difficulty: 'Intermédiaire' },
    { name: currentContent.subjects.literature, icon: '📚', color: 'bg-amber-500', lessons: 35, progress: 89, difficulty: 'Facile' },
    { name: currentContent.subjects.french, icon: '🇫🇷', color: 'bg-red-500', lessons: 30, progress: 56, difficulty: 'Intermédiaire' },
    { name: currentContent.subjects.english, icon: '🇬🇧', color: 'bg-indigo-500', lessons: 28, progress: 43, difficulty: 'Facile' },
    { name: currentContent.subjects.philosophy, icon: '🤔', color: 'bg-gray-500', lessons: 25, progress: 67, difficulty: 'Avancé' },
    { name: currentContent.subjects.history, icon: '🌍', color: 'bg-orange-500', lessons: 33, progress: 74, difficulty: 'Intermédiaire' }
  ];

  const testimonials = [
    currentContent.testimonials.student1,
    currentContent.testimonials.student2,
    currentContent.testimonials.student3
  ];

  return (
    <div className={`min-h-screen ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Enhanced Navigation */}
      <nav className={`border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300 ${scrollY > 50 ? 'shadow-lg' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex items-center">
                <div className="relative">
                  <GraduationCap className="h-8 w-8 text-emerald-600" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
                </div>
                <span className="ml-2 rtl:mr-2 text-xl font-bold text-gray-900">
                  {language === 'ar' ? 'تعلم' : 'EduDZ'}
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
              <a href="#courses" className="text-gray-700 hover:text-emerald-600 transition-colors relative group">
                {currentContent.nav.courses}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 transition-all group-hover:w-full"></span>
              </a>
              <a href="#exams" className="text-gray-700 hover:text-emerald-600 transition-colors relative group">
                {currentContent.nav.exams}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 transition-all group-hover:w-full"></span>
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-emerald-600 transition-colors relative group">
                {currentContent.nav.pricing}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 transition-all group-hover:w-full"></span>
              </a>
              <a href="#about" className="text-gray-700 hover:text-emerald-600 transition-colors relative group">
                {currentContent.nav.about}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 transition-all group-hover:w-full"></span>
              </a>
            </div>

            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex items-center space-x-2 rtl:space-x-reverse bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setLanguage('ar')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${language === 'ar' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600 hover:text-emerald-600'}`}
                >
                  العربية
                </button>
                <button
                  onClick={() => setLanguage('fr')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${language === 'fr' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600 hover:text-emerald-600'}`}
                >
                  FR
                </button>
              </div>
              <div className="hidden md:flex items-center space-x-3 rtl:space-x-reverse">
                <Button variant="ghost" size="sm" className="hover:bg-emerald-50" onClick={handleAuthClick}>
                  {currentContent.nav.login}
                </Button>
                {!user && (
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all" onClick={handleAuthClick}>
                    {currentContent.nav.signup}
                  </Button>
                )}
              </div>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-4 space-y-3">
              <a href="#courses" className="block py-2 text-gray-700 hover:text-emerald-600 transition-colors">
                {currentContent.nav.courses}
              </a>
              <a href="#exams" className="block py-2 text-gray-700 hover:text-emerald-600 transition-colors">
                {currentContent.nav.exams}
              </a>
              <a href="#pricing" className="block py-2 text-gray-700 hover:text-emerald-600 transition-colors">
                {currentContent.nav.pricing}
              </a>
              <div className="pt-3 border-t">
                <Button variant="ghost" size="sm" className="w-full mb-2" onClick={handleAuthClick}>
                  {currentContent.nav.login}
                </Button>
                {!user && (
                  <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={handleAuthClick}>
                    {currentContent.nav.signup}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-emerald-100 text-emerald-800 border-emerald-200 animate-fade-in-up">
                <Globe className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                {language === 'ar' ? 'منصة معتمدة رسمياً من الديوان الوطني' : 'Plateforme officiellement approuvée par ONEC'}
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up">
              {currentContent.hero.title}
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in-up delay-200">
              {currentContent.hero.subtitle}
            </p>
            
            <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto animate-fade-in-up delay-300">
              {currentContent.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-500">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105" onClick={handleAuthClick}>
                {currentContent.hero.cta}
                <ArrowRight className="ml-2 rtl:mr-2 rtl:ml-0 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-2 hover:bg-emerald-50 transition-all">
                <Play className="mr-2 rtl:ml-2 rtl:mr-0 h-5 w-5" />
                {currentContent.hero.watchDemo}
              </Button>
            </div>

            <div className="mt-8 animate-fade-in-up delay-700">
              <p className="text-sm text-gray-500 mb-2">{currentContent.hero.freeTrial}</p>
              <div className="flex justify-center items-center space-x-4 rtl:space-x-reverse text-sm text-gray-400">
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0 text-emerald-500" />
                  {language === 'ar' ? 'بدون بطاقة ائتمان' : 'Sans carte de crédit'}
                </span>
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0 text-emerald-500" />
                  {language === 'ar' ? 'إلغاء في أي وقت' : 'Annulation libre'}
                </span>
              </div>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mt-16 pt-16 border-t border-gray-200">
              {[
                { label: currentContent.stats.students, value: '50K+', icon: Users, color: 'text-emerald-600' },
                { label: currentContent.stats.courses, value: '500+', icon: BookOpen, color: 'text-blue-600' },
                { label: currentContent.stats.success, value: '95%', icon: Trophy, color: 'text-amber-600' },
                { label: currentContent.stats.teachers, value: '200+', icon: GraduationCap, color: 'text-purple-600' },
                { label: currentContent.stats.hours, value: '100K+', icon: Clock, color: 'text-red-600' },
                { label: currentContent.stats.downloads, value: '1M+', icon: Download, color: 'text-green-600' }
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50 mb-3 group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className={`text-2xl md:text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {currentContent.features.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {currentContent.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { ...currentContent.features.adaptive, icon: Brain, color: 'emerald' },
              { ...currentContent.features.curriculum, icon: CheckCircle, color: 'blue' },
              { ...currentContent.features.offline, icon: Wifi, color: 'amber' },
              { ...currentContent.features.multilingual, icon: Globe, color: 'purple' },
              { ...currentContent.features.mobile, icon: Smartphone, color: 'green' },
              { ...currentContent.features.simulation, icon: Target, color: 'red' },
              { ...currentContent.features.analytics, icon: BarChart3, color: 'indigo' },
              { ...currentContent.features.community, icon: Users, color: 'pink' }
            ].map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-${feature.color}-200 transition-colors group-hover:scale-110 transform duration-300`}>
                    <feature.icon className={`h-8 w-8 text-${feature.color}-600`} />
                  </div>
                  <CardTitle className="text-lg group-hover:text-emerald-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Subjects Section */}
      <section className="py-20 bg-gray-50" id="courses">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {currentContent.subjects.title}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {currentContent.subjects.description}
            </p>
            
            <Tabs defaultValue="all" className="w-full max-w-md mx-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">{language === 'ar' ? 'الكل' : 'Tous'}</TabsTrigger>
                <TabsTrigger value="sciences">{language === 'ar' ? 'علوم' : 'Sciences'}</TabsTrigger>
                <TabsTrigger value="letters">{language === 'ar' ? 'آداب' : 'Lettres'}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjectData.map((subject, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className={`w-12 h-12 ${subject.color} rounded-lg flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform`}>
                        {subject.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-emerald-600 transition-colors">
                          {subject.name}
                        </CardTitle>
                        <CardDescription className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span>{subject.lessons} {language === 'ar' ? 'درس' : 'leçons'}</span>
                          <Badge variant="outline" className="text-xs">
                            {subject.difficulty}
                          </Badge>
                        </CardDescription>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-600 transition-colors group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{language === 'ar' ? 'التقدم' : 'Progrès'}</span>
                      <span className="font-medium">{subject.progress}%</span>
                    </div>
                    <Progress value={subject.progress} className="h-2" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="px-8 py-3">
              {currentContent.subjects.viewAll}
              <ArrowRight className="ml-2 rtl:mr-2 rtl:ml-0 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {currentContent.testimonials.title}
            </h2>
            <p className="text-xl text-gray-600">
              {currentContent.testimonials.subtitle}
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(${language === 'ar' ? currentTestimonial * 100 : -currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <Card className="max-w-4xl mx-auto relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
                      <CardHeader className="text-center pb-4">
                        <div className="flex justify-center mb-6">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-6 w-6 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <blockquote className="text-xl md:text-2xl text-gray-700 italic leading-relaxed mb-6">
                          "{testimonial.testimonial}"
                        </blockquote>
                      </CardHeader>
                      <CardContent className="text-center">
                        <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse mb-4">
                          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                            <User className="h-8 w-8 text-emerald-600" />
                          </div>
                          <div className="text-left rtl:text-right">
                            <h4 className="font-bold text-lg text-gray-900">{testimonial.name}</h4>
                            <p className="text-gray-600 text-sm">{testimonial.school}</p>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse mt-1">
                              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                                {testimonial.grade}
                              </Badge>
                              <Badge className="bg-amber-100 text-amber-800">
                                {language === 'ar' ? 'معدل' : 'Note'}: {testimonial.score}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center mt-8 space-x-2 rtl:space-x-reverse">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial ? 'bg-emerald-600 w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-emerald-700 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white opacity-10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white opacity-5 rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Mail className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {currentContent.newsletter.title}
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            {currentContent.newsletter.subtitle}
          </p>

          <div className="max-w-md mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder={currentContent.newsletter.placeholder}
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-500"
              />
              <Button className="bg-white text-emerald-600 hover:bg-emerald-50 px-6 py-3 font-medium shadow-lg hover:shadow-xl transition-all">
                {currentContent.newsletter.subscribe}
                <ArrowRight className="ml-2 rtl:mr-2 rtl:ml-0 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-emerald-100">
            {currentContent.newsletter.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                <CheckCircle className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {currentContent.pricing.title}
            </h2>
            <p className="text-xl text-gray-600">
              {currentContent.pricing.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="relative hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{currentContent.pricing.free.title}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{currentContent.pricing.free.price}</span>
                  <span className="text-gray-600">/{currentContent.pricing.free.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {currentContent.pricing.free.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mr-3 rtl:ml-3 rtl:mr-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6" variant="outline" onClick={handleAuthClick}>
                  {language === 'ar' ? 'ابدأ مجاناً' : 'Commencer gratuitement'}
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="relative hover:shadow-xl transition-all duration-300 border-emerald-500 border-2">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-emerald-600 text-white px-4 py-1">
                  {language === 'ar' ? 'الأكثر شعبية' : 'Plus populaire'}
                </Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{currentContent.pricing.premium.title}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-emerald-600">{currentContent.pricing.premium.price}</span>
                  <span className="text-gray-600">/{currentContent.pricing.premium.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {currentContent.pricing.premium.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mr-3 rtl:ml-3 rtl:mr-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700" onClick={handleAuthClick}>
                  {language === 'ar' ? 'اشترك الآن' : 'S\'abonner maintenant'}
                </Button>
              </CardContent>
            </Card>

            {/* School Plan */}
            <Card className="relative hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{currentContent.pricing.school.title}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{currentContent.pricing.school.price}</span>
                  <span className="text-gray-600">/{currentContent.pricing.school.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {currentContent.pricing.school.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mr-3 rtl:ml-3 rtl:mr-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6" variant="outline">
                  {language === 'ar' ? 'اتصل بنا' : 'Nous contacter'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-emerald-700 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white opacity-10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white opacity-5 rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {currentContent.cta.title}
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            {currentContent.cta.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105" onClick={handleAuthClick}>
              {currentContent.cta.button}
              <ArrowRight className="ml-2 rtl:mr-2 rtl:ml-0 h-5 w-5" />
            </Button>
            <div className="flex items-center text-emerald-100 text-sm">
              <Shield className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {currentContent.cta.guarantee}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center mb-6">
                <GraduationCap className="h-8 w-8 text-emerald-400" />
                <span className="ml-2 rtl:mr-2 text-xl font-bold">
                  {language === 'ar' ? 'منصة التعلم الجزائرية' : 'EduDZ Platform'}
                </span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                {currentContent.footer.description}
              </p>
              <div className="flex items-center space-x-4 rtl:space-x-reverse mb-6">
                <Heart className="h-5 w-5 text-red-400" />
                <span className="text-gray-400">
                  {currentContent.footer.madeWith}
                </span>
              </div>
              <div className="flex space-x-4 rtl:space-x-reverse">
                {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors">
                    <span className="text-sm font-bold">{social[0].toUpperCase()}</span>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-lg">
                {currentContent.footer.quickLinks}
              </h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 rtl:hover:-translate-x-1 inline-block">{language === 'ar' ? 'عن المنصة' : 'À propos'}</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 rtl:hover:-translate-x-1 inline-block">{language === 'ar' ? 'كيف تعمل' : 'Comment ça marche'}</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 rtl:hover:-translate-x-1 inline-block">{language === 'ar' ? 'الأسعار' : 'Tarifs'}</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 rtl:hover:-translate-x-1 inline-block">{language === 'ar' ? 'المدونة' : 'Blog'}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-lg">
                {currentContent.footer.subjects}
              </h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 rtl:hover:-translate-x-1 inline-block">{language === 'ar' ? 'الرياضيات' : 'Mathématiques'}</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 rtl:hover:-translate-x-1 inline-block">{language === 'ar' ? 'الفيزياء' : 'Physique'}</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 rtl:hover:-translate-x-1 inline-block">{language === 'ar' ? 'الكيمياء' : 'Chimie'}</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 rtl:hover:-translate-x-1 inline-block">{language === 'ar' ? 'الأدب' : 'Littérature'}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-lg">
                {currentContent.footer.contact}
              </h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  <span>023 45 67 89</span>
                </li>
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  <span>info@edudz.com</span>
                </li>
                <li className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  <span>{language === 'ar' ? 'الجزائر العاصمة' : 'Alger, Algérie'}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 {language === 'ar' ? 'منصة التعلم الجزائرية' : 'EduDZ Platform'}. {currentContent.footer.rights}
            </p>
            <div className="flex space-x-6 rtl:space-x-reverse mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                {language === 'ar' ? 'سياسة الخصوصية' : 'Confidentialité'}
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                {language === 'ar' ? 'شروط الاستخدام' : 'Conditions'}
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                {language === 'ar' ? 'ملفات تعريف الارتباط' : 'Cookies'}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}