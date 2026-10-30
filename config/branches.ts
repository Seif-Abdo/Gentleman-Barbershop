export interface Branch {
  id: string; // url slug: 'zahraa-maadi', 'nasr-city', 'new-maadi'
  nameAr: string;
  nameEn: string;
  taglineAr: string;
  taglineEn: string;
  addressAr: string;
  addressEn: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  hoursAr: string;
  hoursEn: string;
  googleMapsUrl: string;
  mapEmbedUrl: string;
  isActive: boolean;
}

export const DEFAULT_BRANCHES: Branch[] = [
  {
    id: "zahraa-maadi",
    nameAr: "زهراء المعادي",
    nameEn: "Zahraa El Maadi",
    taglineAr: "الفرع الرئيسي الأصيل · تجربة الحلاقة الملكية",
    taglineEn: "The Flagship Lounge · Royal Grooming",
    addressAr: "شارع الخمسين، زهراء المعادي، القاهرة",
    addressEn: "50th St, Zahraa El Maadi, Cairo",
    phone: "+201001234567",
    phoneDisplay: "0100 123 4567",
    whatsapp: "201001234567",
    hoursAr: "يومياً من 11:00 صباحاً حتى 12:00 منتصف الليل (الجمعة من 1:00 ظهراً)",
    hoursEn: "Daily 11:00 AM – 12:00 Midnight (Friday from 1:00 PM)",
    googleMapsUrl: "https://maps.google.com/?q=Zahraa+El+Maadi+Cairo",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110502.61185066922!2d31.2584643!3d29.9602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458380ff9821267%3A0x6b63690d56ee255e!2sZahraa%20El-Maadi%2C%20Cairo!5e0!3m2!1sen!2seg!4v1700000000000!5m2!1sen!2seg",
    isActive: true,
  },
  {
    id: "nasr-city",
    nameAr: "مدينة نصر",
    nameEn: "Nasr City",
    taglineAr: "فرع النخبة والشباب · أحدث صيحات التصفيف",
    taglineEn: "The Executive Hub · Modern Fades & Care",
    addressAr: "شارع عباس العقاد، تقاطع الطيران، مدينة نصر، القاهرة",
    addressEn: "Abbas El-Akkad St, Nasr City, Cairo",
    phone: "+201009876543",
    phoneDisplay: "0100 987 6543",
    whatsapp: "201009876543",
    hoursAr: "يومياً من 12:00 ظهراً حتى 1:00 صباحاً (الجمعة من 1:30 ظهراً)",
    hoursEn: "Daily 12:00 PM – 1:00 AM (Friday from 1:30 PM)",
    googleMapsUrl: "https://maps.google.com/?q=Abbas+El+Akkad+Nasr+City+Cairo",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110452.123456789!2d31.3324643!3d30.0502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583e5c00000001%3A0x123456789abcdef!2sAbbas%20El-Akkad%2C%20Nasr%20City!5e0!3m2!1sen!2seg!4v1700000000000!5m2!1sen!2seg",
    isActive: true,
  },
  {
    id: "new-maadi",
    nameAr: "المعادي الجديدة",
    nameEn: "New Maadi",
    taglineAr: "فرع الفخامة والهدوء · جلسات استرخاء VIP",
    taglineEn: "The Luxury Retreat · VIP Spa & Grooming",
    addressAr: "شارع النصر، المعادي الجديدة، القاهرة",
    addressEn: "El-Nasr St, New Maadi, Cairo",
    phone: "+201005554321",
    phoneDisplay: "0100 555 4321",
    whatsapp: "201005554321",
    hoursAr: "يومياً من 11:00 صباحاً حتى 12:00 منتصف الليل (الجمعة من 1:00 ظهراً)",
    hoursEn: "Daily 11:00 AM – 12:00 Midnight (Friday from 1:00 PM)",
    googleMapsUrl: "https://maps.google.com/?q=New+Maadi+Cairo",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110502.61185066922!2d31.2884643!3d29.9702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458380ff9821267%3A0x6b63690d56ee255e!2sNew%20Maadi%2C%20Cairo!5e0!3m2!1sen!2seg!4v1700000000000!5m2!1sen!2seg",
    isActive: true,
  },
];
