export interface Branch {
  id: string; // url slug: 'zahraa-maadi', 'nasr-city', 'abou-dawoud'
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
    taglineAr: "الفرع الأصيل · تجربة الحلاقة والراحة الملكية",
    taglineEn: "The Flagship Lounge · Royal Grooming",
    addressAr: "83 شارع المستقبل متفرع من شارع الخمسين، زهراء المعادي، القاهرة",
    addressEn: "83 Al Mostaqbal St., off 50th St., Zahraa El Maadi, Cairo",
    phone: "+201005107683",
    phoneDisplay: "0100 510 7683",
    whatsapp: "201005107683",
    hoursAr: "يومياً من 11:00 صباحاً حتى 12:00 منتصف الليل (الجمعة من 1:00 ظهراً)",
    hoursEn: "Daily 11:00 AM – 12:00 Midnight (Friday from 1:00 PM)",
    googleMapsUrl: "https://www.google.com/maps/place/Gentelman+barber/@29.9638756,31.3101237,19z",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d432.0682201999296!2d31.310456146695714!3d29.963741704679652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583900444f0065%3A0xef7cb137f842cdae!2sGentelman%20barber!5e0!3m2!1sen!2seg!4v1793446606639!5m2!1sen!2seg",
    isActive: true,
  },
  {
    id: "nasr-city",
    nameAr: "مدينة نصر (حسن المأمون)",
    nameEn: "Nasr City (Hassan El Maamoun)",
    taglineAr: "فرع النخبة والشباب · أحدث صيحات التصفيف والعناية",
    taglineEn: "The Executive Hub · Modern Fades & Care",
    addressAr: "19 جمال الدين عفيفي متفرع من حسن المأمون، مدينة نصر، القاهرة",
    addressEn: "19 Gamal El Din Afifi St., off Hassan El Maamoun, Nasr City, Cairo",
    phone: "+201068629217",
    phoneDisplay: "0106 862 9217",
    whatsapp: "201068629217",
    hoursAr: "يومياً من 12:00 ظهراً حتى 1:00 صباحاً (الجمعة من 1:30 ظهراً)",
    hoursEn: "Daily 12:00 PM – 1:00 AM (Friday from 1:30 PM)",
    googleMapsUrl: "https://maps.google.com/?q=19+Gamal+El+Din+Afifi+Hassan+El+Maamoun+Nasr+City+Cairo",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110452.123456789!2d31.3324643!3d30.0502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583e5c00000001%3A0x123456789abcdef!2sHassan%20El%20Maamoun%2C%20Nasr%20City!5e0!3m2!1sen!2seg!4v1700000000000!5m2!1sen!2seg",
    isActive: true,
  },
  {
    id: "abou-dawoud",
    nameAr: "مدينة نصر (أبوداود الظاهري)",
    nameEn: "Nasr City (Abou Dawoud El Zahery)",
    taglineAr: "فرع أبو داود الظاهري · تميز وفخامة متكاملة",
    taglineEn: "Abou Dawoud El Zahery Lounge · Elite Grooming",
    addressAr: "74 ش معز الدولة - خلف البنك الأهلي، متفرع من أبو داود الظاهري، مدينة نصر، القاهرة",
    addressEn: "74 Moez El Dawla St., behind National Bank of Egypt, off Abou Dawoud El Zahery, Nasr City, Cairo",
    phone: "+201055450225",
    phoneDisplay: "0105 545 0225",
    whatsapp: "201055450225",
    hoursAr: "يومياً من 12:00 ظهراً حتى 1:00 صباحاً (الجمعة من 1:30 ظهراً)",
    hoursEn: "Daily 12:00 PM – 1:00 AM (Friday from 1:30 PM)",
    googleMapsUrl: "https://maps.google.com/?q=74+Moez+El+Dawla+Nasr+City+Cairo",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110452.123456789!2d31.3324643!3d30.0502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583e5c00000001%3A0x123456789abcdef!2sAbou%20Dawoud%20El%20Zahery%2C%20Nasr%20City!5e0!3m2!1sen!2seg!4v1700000000000!5m2!1sen!2seg",
    isActive: true,
  },
];
