export interface EssayTopic {
  id: string;
  title: string;
  category: string;
  frequency: string;
  description: string;
  keyPoints: string[];
  outline: {
    introduction: string;
    bodyPara1: string;
    bodyPara2: string;
    conclusion: string;
  };
  modelEssay: string;
  wordCountTarget: string;
  rules: string[];
}

export const ESSAY_TOPICS: EssayTopic[] = [
  {
    "id": "wet_1",
    "title": "Social media has made it easier to misuse one's right to freedom of expression",
    "category": "Technology & Society",
    "frequency": "VERY_HIGH",
    "description": "Analyze how anonymity, viral algorithms, and decentralized publishing on social media platforms have led to hate speech, cyberbullying, and disinformation, balanced against legitimate free expression.",
    "keyPoints": [
      "Anonymity and distance lower psychological barriers to cyberbullying and toxic commentary.",
      "Algorithm-driven echo chambers incentivize sensationalism and rage-baiting over factual discourse.",
      "Right to freedom of expression is not absolute; it carries civic responsibility and legal boundaries against defamation and incitement.",
      "Balance between platform regulation, digital literacy, and personal accountability."
    ],
    "outline": {
      "introduction": "Define freedom of expression and describe how digital platforms have democratized global communication while eliminating traditional editorial gatekeepers.",
      "bodyPara1": "Discuss the proliferation of misinformation, defamatory content, and online harassment driven by platform anonymity.",
      "bodyPara2": "Examine the role of algorithmic amplification in polarizing public debates and radicalizing impressionable demographics.",
      "conclusion": "Advocate for a multi-stakeholder framework: robust automated content moderation, digital ethics curriculum, and civil discourse guidelines."
    },
    "modelEssay": "Freedom of expression is widely heralded as a cornerstone of democratic societies, empowering individuals to voice opinions without fear of state censorship. However, the advent of ubiquitous social media platforms—such as X, Instagram, and Reddit—has radically lowered the friction of content dissemination, frequently enabling the misuse of this fundamental liberty.\n\nFirst and foremost, digital anonymity acts as a psychological shield. When users can conceal their real identities behind pseudonyms, the natural social constraints that deter hate speech, targeted harassment, and character assassination dissipate. Furthermore, corporate engagement algorithms prioritize sensational, emotionally provocative content over nuanced factual analysis. As a consequence, unverified rumors, deepfakes, and defamatory allegations can propagate across continents in mere minutes, irreparably harming personal reputations and inciting real-world violence before corrective facts emerge.\n\nNonetheless, curbing this misuse requires careful calibration. Heavy-handed censorship by centralized authorities or tech conglomerates risks stifling whistleblowers, investigative journalists, and legitimate dissent. The solution does not lie in revoking free speech, but rather in demanding algorithmic transparency, strictly enforcing platform community guidelines, and prosecuting intentional cyber defamation.\n\nIn conclusion, while social media has undeniably expanded individual reach, it has simultaneously lowered the barriers to abusing expressive freedom. A sustainable digital ecosystem requires both technological accountability and heightened civic awareness among netizens to ensure that freedom of speech does not degenerate into freedom to harm.",
    "wordCountTarget": "250 - 350 words",
    "rules": [
      "Strictly maintain word count between 200 and 400 words (Capgemini WET standard).",
      "Avoid slang, contractions (use 'do not' instead of 'don't'), and bullet points in the actual essay.",
      "Maintain distinct paragraph breaks for Introduction, Body Paragraphs, and Conclusion."
    ]
  },
  {
    "id": "wet_2",
    "title": "Violent video games affect children negatively",
    "category": "Youth & Media Psychology",
    "frequency": "VERY_HIGH",
    "description": "Debate whether immersive violent video games induce aggression, desensitization, and reduced empathy in young adolescents, or whether they serve as cathartic stress-relief and cognitive coordination training.",
    "keyPoints": [
      "Desensitization to real-world suffering and normalized virtual violence.",
      "Sedentary screen time displacing physical activity, academic focus, and offline social interaction.",
      "Counter-argument: development of hand-eye coordination, rapid spatial decision-making, and teamwork in multiplayer esports.",
      "The pivotal role of parental oversight and ESRB/PEGI age-rating compliance."
    ],
    "outline": {
      "introduction": "Introduce the exponential growth of gaming culture and the fierce debate over its cognitive and behavioral impact on young minds.",
      "bodyPara1": "Examine psychological evidence regarding aggressive ideation, reduced empathy, and impulsive behavior triggered by repetitive violent stimuli.",
      "bodyPara2": "Acknowledge beneficial cognitive facets (reflexes, spatial reasoning) while demonstrating that developmental vulnerability in children outweighs these benefits without moderation.",
      "conclusion": "Call for proactive parental gatekeeping, adherence to age classifications, and balanced recreational habits."
    },
    "modelEssay": "The modern digital gaming industry has evolved from simplistic two-dimensional pixels into photorealistic, deeply immersive simulations. While video games offer interactive entertainment and cognitive engagement, the escalating depiction of graphic violence in mainstream titles raises pressing concerns regarding its psychological impact on impressionable children.\n\nEmpirical research in behavioral psychology demonstrates that prolonged exposure to simulated violence can desensitize young brains to aggressive behaviors. Unlike passive media such as television, video games require the player to actively participate in and be rewarded for virtual violence. Over time, this repetitive conditioning can erode emotional empathy, increase autonomic tolerance to aggression, and predispose children toward hostile attribution bias during peer conflicts. Furthermore, excessive gaming often displaces essential physical recreation, healthy sleep schedules, and collaborative offline socialization.\n\nConversely, proponents argue that gaming enhances spatial problem-solving, fine motor coordination, and strategic foresight. While these cognitive dividends are legitimate, they can be readily cultivated through non-violent puzzle, simulation, or strategy games without exposing pre-teens to graphic bloodshed.\n\nTo mitigate these adverse effects, parents, educators, and game developers must share responsibility. Strict adherence to age-rating mechanisms (such as PEGI and ESRB) coupled with enforced daily screen limits can prevent digital addiction. In summary, violent video games pose demonstrable developmental risks to children; safeguarding youth requires balanced curation and attentive parental guidance.",
    "wordCountTarget": "250 - 350 words",
    "rules": [
      "Structure: Introduction (hook + thesis), 2 body paragraphs (arguments & rebuttal), Conclusion.",
      "Use formal academic tone and precise transitional phrases (Furthermore, Conversely, In summary)."
    ]
  },
  {
    "id": "wet_3",
    "title": "SMART classrooms or traditional classrooms teaching: which are more effective and why?",
    "category": "Education & Technology",
    "frequency": "HIGH",
    "description": "Evaluate the educational efficacy of interactive digital SMART classrooms (visual animations, interactive boards, instant assessments) versus traditional teacher-centric pedagogies.",
    "keyPoints": [
      "SMART classrooms cater to visual, auditory, and kinesthetic learning styles through multimedia simulation.",
      "Instant access to global digital libraries and gamified learning boosts student retention.",
      "Traditional classrooms cultivate deep teacher-student rapport, discipline, and reflective concentration free of screen distractions.",
      "A hybrid blended model yields optimal educational outcomes."
    ],
    "outline": {
      "introduction": "Present the ongoing transition from blackboards to interactive multimedia displays across educational institutions.",
      "bodyPara1": "Highlight the strengths of SMART classrooms: enhanced engagement, 3D conceptual modeling, and digitized resource availability.",
      "bodyPara2": "Discuss traditional merits: personal mentorship, interpersonal dialogue, and absence of technical glitches or digital fatigue.",
      "conclusion": "Conclude that a blended pedagogy, utilizing technology as a pedagogical amplifier under human guidance, is most effective."
    },
    "modelEssay": "Education stands at the intersection of tradition and digital innovation. The debate between multimedia-enabled SMART classrooms and conventional blackboard teaching centers on how modern pedagogical tools influence student engagement, comprehension, and long-term knowledge retention.\n\nSMART classrooms provide distinct pedagogical advantages by integrating interactive displays, 3D simulations, and multimedia animations. Complex scientific concepts—such as the double-helix DNA structure or orbital mechanics—which are difficult to visualize on a flat chalkboard, come alive through digital modeling. This visual approach accommodates multimodal learners and substantially improves student attentiveness. Moreover, digitized platforms facilitate continuous online assessments, automated grading, and instant access to worldwide educational repositories.\n\nNevertheless, technology cannot entirely replace the intrinsic value of traditional pedagogy. Traditional classrooms foster indispensable interpersonal connections, discipline, and emotional empathy through direct teacher-student mentorship. Without an attentive educator, SMART equipment risks devolving into passive screen consumption, leading to digital fatigue and fragmented attention spans.\n\nUltimately, neither paradigm is complete in isolation. The most effective instructional model is a blended hybrid framework, where smart technologies serve as powerful cognitive aids while compassionate, skilled educators anchor classroom discussion, critical analysis, and moral development.",
    "wordCountTarget": "250 - 350 words",
    "rules": [
      "200-400 words",
      "Clear thesis in introduction",
      "Strong paragraph transitions"
    ]
  },
  {
    "id": "wet_4",
    "title": "Success comes to those who take risks",
    "category": "Philosophy & Professional Growth",
    "frequency": "HIGH",
    "description": "Assess the premise that meaningful breakthrough accomplishments require calculated risk-taking and stepping beyond safety zones.",
    "keyPoints": [
      "Status quo yields predictable, average returns; disruption demands venturing into uncertainty.",
      "Calculated risks vs reckless gambles: importance of market research, contingency planning, and resilience.",
      "Failure as a vital data point and stepping stone toward mastery."
    ],
    "outline": {
      "introduction": "Define the relationship between risk, innovation, and professional achievement.",
      "bodyPara1": "Provide examples of groundbreaking business and scientific ventures built on daring decisions (e.g. Steve Jobs, Elon Musk, Marie Curie).",
      "bodyPara2": "Distinguish calculated risks backed by preparation from irresponsible recklessness.",
      "conclusion": "Synthesize how courage and resilience transform uncertainty into triumphant progress."
    },
    "modelEssay": "Throughout human history, monumental breakthroughs in science, commerce, and personal ambition have never originated within the comforting boundaries of complacency. The maxim that 'success comes to those who take risks' encapsulates the fundamental truth that high achievement demands the willingness to confront uncertainty.\n\nRemaining strictly within one's comfort zone guarantees predictability, but it seldom generates groundbreaking innovation. Whether examining the audacious trajectory of technology entrepreneurs like Steve Jobs or the perseverance of trailblazing scientists, transformative progress requires venturing into uncharted territory. Taking bold steps forces individuals to develop unprecedented problem-solving abilities, uncover latent market opportunities, and build adaptive resilience.\n\nCrucially, embracing risk does not denote reckless gambling. True achievers distinguish themselves through calculated risk-taking—systematically analyzing worst-case scenarios, developing robust contingency strategies, and making informed leaps of faith. Even when calculated risks culminate in temporary setbacks, the experiential insights gained serve as invaluable stepping stones toward future mastery.\n\nIn conclusion, while calculated risks inevitably carry the possibility of failure, avoiding risk altogether guarantees stagnation. Those who dare to challenge convention and navigate uncertainty are the ones who ultimately shape the future and achieve enduring greatness.",
    "wordCountTarget": "250 - 350 words",
    "rules": [
      "200-400 words",
      "Persuasive rhetoric",
      "Concrete examples"
    ]
  },
  {
    "id": "wet_5",
    "title": "People today are more materialistic and less satisfied as compared to previous generations",
    "category": "Consumerism & Well-being",
    "frequency": "HIGH",
    "description": "Analyze whether the modern culture of consumerism, luxury advertising, and social media comparison has made today's generation more materialistic yet less genuinely fulfilled.",
    "keyPoints": [
      "Hyper-consumerism driven by targeted digital marketing and planned obsolescence.",
      "Hedonic treadmill: the pursuit of material possessions offering transient gratification rather than lasting purpose.",
      "Social comparison via curated feeds fostering feelings of relative deprivation.",
      "Previous generations prioritizing communal solidarity, frugality, and interpersonal stability."
    ],
    "outline": {
      "introduction": "Observe the paradox of unprecedented modern material abundance alongside rising rates of anxiety and disillusionment.",
      "bodyPara1": "Discuss consumer culture, aggressive advertising, and how possessions are equated with personal self-worth.",
      "bodyPara2": "Contrast with past generations' emphasis on familial bonds, simplicity, and sustainable community living.",
      "conclusion": "Advocate for mindful consumption, redefining success in terms of personal growth and relationships rather than material acquisition."
    },
    "modelEssay": "In an era characterized by unprecedented technological convenience and consumer abundance, modern society finds itself entangled in a poignant paradox. Despite possessing standards of living that vastly eclipse those of earlier eras, contemporary generations often exhibit heightened materialism accompanied by diminished life satisfaction.\n\nIndustrial mass production, coupled with sophisticated algorithmic advertising, has cultivated a pervasive consumerist culture. Possessions—such as the latest smartphones, luxury designer apparel, and sports vehicles—are no longer viewed merely as functional utilities; they have become social emblems of personal worth and status. However, psychological research into the 'hedonic treadmill' proves that material acquisitions provide only ephemeral spikes in happiness. The insatiable urge to perpetually upgrade purchases traps individuals in an exhausting cycle of acquisition, financial strain, and perpetual inadequacy.\n\nFurthermore, 24/7 exposure to social media feeds amplifies this discontent. While previous generations found contentment in close-knit communities, sustainable frugality, and stable family structures, modern youth constantly compare their daily realities against the curated, affluent lifestyles of digital influencers.\n\nIn conclusion, modern prosperity has unfortunately prioritized material wealth over psychological equilibrium. To reclaim genuine fulfillment, contemporary society must consciously pivot from conspicuous consumption toward cultivating deep human connections, intellectual curiosity, and gratitude for non-material pursuits.",
    "wordCountTarget": "250 - 350 words",
    "rules": [
      "200-400 words",
      "Analytical depth",
      "Cohesive argument"
    ]
  },
  {
    "id": "wet_6",
    "title": "Do you think progress is always good? Cite examples to support your view",
    "category": "Science & Ethics",
    "frequency": "MEDIUM",
    "description": "Examine the double-edged sword of technological and economic progress, such as industrial growth versus environmental collapse, or AI efficiency versus workforce displacement.",
    "keyPoints": [
      "Technological advancements curing diseases, connecting continents, and boosting productivity.",
      "Unintended ramifications: ecological devastation, weaponization, and existential technological hazards.",
      "The essential imperative of ethical alignment and sustainable oversight."
    ],
    "outline": {
      "introduction": "Define human progress and challenge the simplistic dogma that all advancement is inherently benign.",
      "bodyPara1": "Exemplify the triumphs of progress: modern medicine, renewable energy, and information access.",
      "bodyPara2": "Exemplify the dark side: ecological degradation, climate crisis, and autonomous warfare systems.",
      "conclusion": "Argue that progress is only truly 'good' when anchored by ethical stewardship and ecological sustainability."
    },
    "modelEssay": "The historical march of human civilization has been driven by an insatiable quest for progress. From the discovery of fire to quantum computing, humanity consistently seeks to transcend its physical limitations. However, to assume that progress is unconditionally beneficial is a dangerous oversimplification; history demonstrates that unchecked advancement frequently brings catastrophic externalities.\n\nUndeniably, progress in medicine, public sanitation, and telecommunications has saved billions of lives, eradicated debilitating diseases, and made global knowledge universally accessible. Agricultural innovations like the Green Revolution prevented widespread famines, while renewable energy technologies promise cleaner industrial operations.\n\nConversely, unfettered industrial progress has triggered catastrophic climate disruptions, rampant deforestation, and unprecedented biodiversity collapse. The nuclear fission discoveries that enabled carbon-free atomic power also birthed weapons capable of global annihilation. In the contemporary realm, advancements in Artificial Intelligence and automated surveillance promise corporate efficiency, but simultaneously threaten massive job obsolescence and algorithmic discrimination.\n\nIn conclusion, progress is neither purely good nor inherently evil; it is an amplifier of human intention. True progress cannot be measured merely by GDP expansion or technological novelty, but by whether our innovations foster equitable well-being and ecological harmony for future generations.",
    "wordCountTarget": "250 - 350 words",
    "rules": [
      "200-400 words",
      "Balanced perspective",
      "Concrete historical examples"
    ]
  }
];
