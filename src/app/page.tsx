import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2 } from "lucide-react";

const documentationSections = [
  {
    title: "Background",
    content: [
      "Happy Chicks is a small-sized poultry-focused farm in the Oti Region of Ghana. The farm specializes in the production of table eggs, supported by occasional broiler production for festive seasons. Additionally, the farm keeps other animals, including pigs, goats, cattle, and sheep. Its main focus, however, is raising laying hens.",
      "The farm operates with 5 sheds capable of holding up to 12,000 birds at full capacity but currently manages 5,400 birds using the deep litter system. The business employs 8 workers, including a manager, to oversee daily operations such as feeding, egg collection, grading, and sales.",
      "The farm currently relies on a manual record-keeping system, which involves workers logging egg collections, feed allocation, mortality rates, and broken egg records in notebooks. However, this approach has proven inadequate as the farm seeks to grow and modernize its operations."
    ]
  },
  {
    title: "Defining the Problem",
    content: [
      "The farm faces several challenges in its daily operations, including:",
      "1. Theft and Accountability Issues: Lack of proper monitoring systems allow for potential theft of feed, eggs, and other resources. No real-time tracking of inventory and sales.",
      "2. Errors in Record-Keeping: Manual records are prone to mistakes due to worker errors in recording and calculating data. The current method makes it difficult to analyze trends such as lay rates, broken egg percentages, and mortality.",
      "3. Inefficient Processes: Workers spend significant time manually recording and totaling data at the end of the day. The process is time-consuming and detracts from other farm activities.",
      "4. Limited Scalability: The manual system cannot efficiently handle the farm's potential growth to full capacity (12,000 birds).",
      "5. Lack of Real-Time Insights: The manager must wait until the end of the day to access farm-wide data, delaying decisions and actions."
    ]
  },
  {
    title: "Aim",
    content: [
      "The aim of this project is to design and develop an automated farm management system tailored to the needs of Happy Chicks. The system will streamline operations, enhance accuracy in record-keeping, and provide real-time data insights. By integrating features for inventory tracking, egg production monitoring, and employee accountability, the system will improve operational efficiency, reduce theft, and position the farm for sustainable growth."
    ]
  },
  {
    title: "Objectives",
    content: [
      "1. Automate Record-Keeping: Develop a user-friendly application to record and calculate egg production, feed allocation, broken eggs, and mortality rates automatically.",
      "2. Enhance Accountability: Implement features to track employee activities and reduce theft.",
      "3. Improve Data Accuracy: Minimize human errors through automated data entry and calculation systems.",
      "4. Real-Time Monitoring: Provide the manager with real-time access to farm data, including inventory, production rates, and employee performance.",
      "5. Enable Scalability: Design the system to handle increased capacity as the farm grows.",
      "6. Generate Reports: Include functionalities to generate daily, weekly, and monthly reports on egg production, broken eggs, and feed usage."
    ]
  },
  {
    title: "Scope and Limitations",
    subSections: [
      {
        title: "Scope:",
        items: [
          "Modules: The system will include modules for egg production tracking, feed allocation management, inventory monitoring, mortality tracking, and reporting.",
          "Access Levels: The system will have user roles, including workers (data entry) and the manager (data analysis and decision-making).",
          "Device Compatibility: The application will be designed for use on mobile devices and desktop computers.",
          "Security Features: Implement login authentication and data encryption to protect sensitive information."
        ]
      },
      {
        title: "Limitations:",
        items: [
          "Initial Costs: The farm may incur expenses for purchasing hardware (e.g., tablets or computers) to use the system.",
          "Digital Literacy: Workers with limited education may require training to use the application effectively.",
          "Internet Dependency: If a cloud-based solution is implemented, reliable internet access will be required for some features.",
          "Maintenance: The system will require periodic updates and maintenance to ensure smooth operation."
        ]
      }
    ]
  },
  {
    title: "Proposed Content / System Features",
    content: [
      "1. System Overview: Description of the automated farm management system, including its key modules and functionalities.",
      "2. Problem Analysis: Detailed explanation of the challenges faced by Happy Chicks and how the system will address them.",
      "3. System Features:",
      "   - Egg Production Tracking: Record egg collection data, broken eggs, and calculate lay rates automatically.",
      "   - Inventory Management: Monitor feed usage and stock levels in real time.",
      "   - Mortality Tracking: Log bird mortality and automatically adjust shed populations.",
      "   - Employee Activity Monitoring: Assign tasks, track completion, and identify discrepancies in records.",
      "   - Report Generation: Generate reports on production, inventory, and employee performance for informed decision-making."
    ]
  },
  {
    title: "Implementation Plan",
    content: [
      "Phase 1: Requirements Gathering: Conduct interviews with the manager and workers to identify specific needs.",
      "Phase 2: System Design: Create a blueprint for the application’s user interface and database structure.",
      "Phase 3: Development: Build the application using appropriate programming tools and frameworks.",
      "Phase 4: Testing: Test the application with real farm data to ensure reliability and ease of use.",
      "Phase 5: Deployment and Training: Deploy the system on the farm and train employees on its usage."
    ]
  },
  {
    title: "Technologies Used",
    content: [
      "Frontend: HTML, CSS, JavaScript (Next.js, React, Tailwind CSS) for the user interface.",
      "Backend: Node.js (Next.js Server Actions, potentially dedicated API routes) or Python/Java for application logic.",
      "Database: Firebase Firestore or MySQL/PostgreSQL for data storage.",
      "AI Integration: Genkit for AI-powered optimization tips.",
      "Cloud Integration: Firebase Hosting, Google Cloud (for Genkit, database) for data backup and remote access."
    ]
  },
  {
    title: "Expected Benefits",
    content: [
      "Reduced theft and improved accountability among employees.",
      "Increased data accuracy and time savings.",
      "Real-time access to critical farm data for better decision-making.",
      "Enhanced scalability to support farm growth."
    ]
  },
  {
    title: "Financial Considerations",
    content: [
      "Budget allocation for system development, hardware procurement, and worker training."
    ]
  },
  {
    title: "Conclusion",
    content: [
      "The proposed farm management system will address the operational challenges faced by Happy Chicks, such as theft, inefficiency, and scalability issues. By automating processes and improving data management, the system will empower the farm to operate more efficiently, minimize losses, and achieve its growth objectives."
    ]
  }
];

export default function DocumentationPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">Developing an Automated Farm Management System for Happy Chicks</CardTitle>
          <CardDescription className="text-md">
            Project proposal and documentation for CluckTrack.
          </CardDescription>
        </CardHeader>
      </Card>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {documentationSections.map((section, index) => (
          <AccordionItem value={`item-${index}`} key={index} className="bg-card border border-border rounded-lg shadow-sm">
            <AccordionTrigger className="px-6 py-4 text-lg font-headline hover:no-underline">
              {section.title}
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 text-foreground/80">
              {section.content && section.content.map((paragraph, pIndex) => (
                <p key={pIndex} className="mb-3 last:mb-0 leading-relaxed">{paragraph}</p>
              ))}
              {section.subSections && section.subSections.map((sub, sIndex) => (
                <div key={sIndex} className="mt-4">
                  <h4 className="font-semibold text-md mb-2 text-foreground/90">{sub.title}</h4>
                  <ul className="list-none space-y-2 pl-2">
                    {sub.items && sub.items.map((item, iIndex) => (
                       <li key={iIndex} className="flex items-start">
                         <CheckCircle2 className="h-5 w-5 text-accent mr-2 mt-0.5 shrink-0" />
                         <span>{item}</span>
                       </li>
                    ))}
                  </ul>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
