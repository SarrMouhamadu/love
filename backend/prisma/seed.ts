import { PrismaClient, UserRole, UserStatus, Gender } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const DEFAULT_INTERESTS = [
  // Sport & Fitness
  { name: 'Football', category: 'Sport' },
  { name: 'Fitness & Musculation', category: 'Sport' },
  { name: 'Running & Jogging', category: 'Sport' },
  { name: 'Natation', category: 'Sport' },
  { name: 'Basketball', category: 'Sport' },

  // Sorties & Loisirs
  { name: 'Plage & Corniche', category: 'Loisirs' },
  { name: 'Restaurants & Gastronomie', category: 'Loisirs' },
  { name: 'Cinéma & Séries', category: 'Loisirs' },
  { name: 'Concerts & Festivals', category: 'Loisirs' },
  { name: 'Voyages & Découvertes', category: 'Loisirs' },

  // Culture & Arts
  { name: 'Musique Mbalax & Afro', category: 'Culture' },
  { name: 'Danse', category: 'Culture' },
  { name: 'Lecture & Philosophie', category: 'Culture' },
  { name: 'Mode & Sabar', category: 'Culture' },
  { name: 'Photographie', category: 'Culture' },

  // Tech & Business
  { name: 'Entrepreneuriat', category: 'Business' },
  { name: 'Technologie & IA', category: 'Tech' },
  { name: 'Startups Africaines', category: 'Business' },
  { name: 'Développement Web & Mobile', category: 'Tech' },

  // Art de vivre
  { name: 'Café & Thé Ataya', category: 'Style de vie' },
  { name: 'Cuisine Sénégalaise (Thiéboudienne)', category: 'Style de vie' },
  { name: 'Méditation & Bien-être', category: 'Style de vie' },
  { name: 'Bénévolat & Actions Sociales', category: 'Style de vie' },
];

async function main() {
  console.log('🌱 Démarrage de l initialisation des données (Seed)...');

  // 1. Seed Interests
  console.log('1️⃣ Création des centres d intérêt...');
  for (const item of DEFAULT_INTERESTS) {
    await prisma.interest.upsert({
      where: { name: item.name },
      create: { name: item.name, category: item.category },
      update: {},
    });
  }

  // 2. Create Super Admin account
  console.log('2️⃣ Création du compte Super Administrateur...');
  const adminPasswordHash = await bcrypt.hash('AdminAnonyme2026!', 12);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@anonymepro.sn' },
    create: {
      email: 'admin@anonymepro.sn',
      passwordHash: adminPasswordHash,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      isVerified: true,
      isPremium: true,
      profile: {
        create: {
          displayName: 'Super Admin',
          birthDate: new Date('1990-01-01'),
          gender: Gender.MALE,
          city: 'Dakar',
          bio: 'Compte principal de supervision de la plateforme Anonyme Pro.',
        },
      },
    },
    update: {},
  });

  // 3. Create Moderator account
  console.log('3️⃣ Création du compte Modérateur...');
  const modPasswordHash = await bcrypt.hash('Moderateur2026!', 12);
  await prisma.user.upsert({
    where: { email: 'moderateur@anonymepro.sn' },
    create: {
      email: 'moderateur@anonymepro.sn',
      passwordHash: modPasswordHash,
      role: UserRole.MODERATOR,
      status: UserStatus.ACTIVE,
      isVerified: true,
      isPremium: true,
      profile: {
        create: {
          displayName: 'Équipe Modération',
          birthDate: new Date('1994-05-15'),
          gender: Gender.FEMALE,
          city: 'Dakar',
          bio: 'Modération active et protection de la communauté Anonyme Pro.',
        },
      },
    },
    update: {},
  });

  // 4. Create sample test profiles in Dakar for immediate discovery testing
  console.log('4️⃣ Création de profils de démonstration à Dakar...');
  const sampleUsers = [
    {
      email: 'aissatou.fall@example.sn',
      displayName: 'Aïssatou',
      gender: Gender.FEMALE,
      birthDate: new Date('1998-04-12'),
      city: 'Dakar (Almadies)',
      profession: 'Designer UI/UX',
      education: 'Master Créa',
      lookingFor: 'Rencontres amicales & réseau créatif',
      bio: 'Passionnée d art, de gastronomie et de couchers de soleil aux Almadies. Toujours partante pour un bon café ou une expo.',
      latitude: 14.7456,
      longitude: -17.5189,
      photos: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
      ],
      interests: ['Mode & Sabar', 'Photographie', 'Café & Thé Ataya', 'Plage & Corniche'],
    },
    {
      email: 'cheikh.diop@example.sn',
      displayName: 'Cheikh',
      gender: Gender.MALE,
      birthDate: new Date('1996-08-23'),
      city: 'Dakar (Plateau)',
      profession: 'Architecte logiciel',
      education: 'École d ingénieur',
      lookingFor: 'Nouvelles connaissances & échanges',
      bio: 'Développeur passionné par l entrepreneuriat africain. Grand amateur de running sur la corniche et de football le weekend.',
      latitude: 14.6723,
      longitude: -17.4328,
      photos: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80',
      ],
      interests: ['Football', 'Running & Jogging', 'Technologie & IA', 'Startups Africaines'],
    },
    {
      email: 'fatou.sow@example.sn',
      displayName: 'Fatou',
      gender: Gender.FEMALE,
      birthDate: new Date('2001-11-05'),
      city: 'Dakar (Mermoz)',
      profession: 'Étudiante en Droit & Économie',
      education: 'Licence 3',
      lookingFor: 'Discussions enrichissantes',
      bio: 'Adore la littérature, les débats d idées et la bonne musique acoustique. Souriante et toujours curieuse d apprendre.',
      latitude: 14.7112,
      longitude: -17.4764,
      photos: [
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80',
      ],
      interests: ['Lecture & Philosophie', 'Musique Mbalax & Afro', 'Restaurants & Gastronomie'],
    },
    {
      email: 'ibrahima.sarr@example.sn',
      displayName: 'Ibrahima',
      gender: Gender.MALE,
      birthDate: new Date('1994-02-18'),
      city: 'Dakar (Yoff)',
      profession: 'Entrepreneur Agroalimentaire',
      education: 'Master Commerce',
      lookingFor: 'Rencontres sincères',
      bio: 'Créateur de projets passionnants. Surf et baignade à Yoff le matin, travail l après-midi. Positif et ambitieux.',
      latitude: 14.7611,
      longitude: -17.4667,
      photos: [
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop&q=80',
      ],
      interests: ['Natation', 'Plage & Corniche', 'Entrepreneuriat', 'Cuisine Sénégalaise (Thiéboudienne)'],
    },
  ];

  const defaultUserPassword = await bcrypt.hash('PassDemo2026!', 12);

  for (const sample of sampleUsers) {
    const user = await prisma.user.upsert({
      where: { email: sample.email },
      create: {
        email: sample.email,
        passwordHash: defaultUserPassword,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        isVerified: true,
        isPremium: true,
        profile: {
          create: {
            displayName: sample.displayName,
            birthDate: sample.birthDate,
            gender: sample.gender,
            city: sample.city,
            bio: sample.bio,
            profession: sample.profession,
            education: sample.education,
            lookingFor: sample.lookingFor,
            latitude: sample.latitude,
            longitude: sample.longitude,
            photos: {
              create: sample.photos.map((url, idx) => ({
                url,
                order: idx,
                isMain: idx === 0,
              })),
            },
          },
        },
      },
      update: {},
      include: { profile: true },
    });

    // Link interests
    if (user.profile) {
      for (const interestName of sample.interests) {
        const interest = await prisma.interest.findUnique({ where: { name: interestName } });
        if (interest) {
          await prisma.userInterest.upsert({
            where: {
              profileId_interestId: {
                profileId: user.profile.id,
                interestId: interest.id,
              },
            },
            create: {
              profileId: user.profile.id,
              interestId: interest.id,
            },
            update: {},
          });
        }
      }
    }
  }

  console.log('✅ Base de données initialisée avec succès !');
  console.log('----------------------------------------------------');
  console.log('👑 Super Admin : admin@anonymepro.sn / AdminAnonyme2026!');
  console.log('🛡️ Modérateur  : moderateur@anonymepro.sn / Moderateur2026!');
  console.log('👥 Démo Users  : Mot de passe par défaut "PassDemo2026!"');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
