export interface Program {
  id: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  icon: string;
  bgImage: string;
  price: string;
  originalPrice?: string;
  featuresEn: string[];
  featuresAr: string[];
}

export interface Transformation {
  id: string;
  name: string;
  beforeImg: string;
  afterImg: string;
  durationEn: string;
  durationAr: string;
  tagEn: string;
  tagAr: string;
  descriptionEn: string;
  descriptionAr: string;
}

export interface FAQItem {
  id: string;
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
}

export interface Step {
  number: number;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  icon: string;
}
