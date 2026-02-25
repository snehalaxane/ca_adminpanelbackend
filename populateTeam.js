// require("dotenv").config();
// const mongoose = require("mongoose");
// const TeamMember = require("./model/TeamMember");

// const teamData = [
//     {
//         name: "M. Siva Ram Prasad",
//         designation: "Founder Partner",
//         city: "Hyderabad",
//         bio: "Founder partner of the firm, in professional practice since 1977. Heads the consultancy division, specializing in Management and Financial Consultancy services and advising on Foreign Exchange Control Laws (FEMA). Has been promoting small, medium and large Business Organisations.",
//         photo: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&q=80",
//         showOnHome: true,
//         showOnTeam: true,
//         order: 1
//     },
//     {
//         name: "S. Ranganathan",
//         designation: "Senior Partner",
//         city: "Hyderabad",
//         bio: "Senior partner of the firm since 1985. Heads the Tax division. Expert in Transfer Pricing Studies, Direct and Indirect Taxes, International Tax, and Tax Appeals. Advises large companies on tax planning and dispute resolution.",
//         photo: "https://images.unsplash.com/photo-1536413233898-1e0310708605?w=800&q=80",
//         showOnHome: true,
//         showOnTeam: true,
//         order: 2
//     },
//     {
//         name: "Padmakant J. Mehta",
//         designation: "Partner",
//         city: "Hyderabad",
//         bio: "Partner since 2001. Qualified Information Systems Auditor (DISA). Expert in Information System Audit, Securities Audits, SEBI inspections, and Capital structuring. Specialized in Initial Public Offer (IPO) Resource Mobilization.",
//         photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80",
//         showOnHome: true,
//         showOnTeam: true,
//         order: 3
//     },
//     {
//         name: "I. Dileep Kumar",
//         designation: "Partner",
//         city: "Hyderabad",
//         bio: "Partner since 2014. Heads the Audit and Assurance division. Expert in Audit & Assurance services in an ERP environment, IFRS reporting, and Forensic Auditing. Certified Fraud Detector and Information System Auditor.",
//         photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80",
//         showOnHome: true,
//         showOnTeam: true,
//         order: 4
//     },
//     {
//         name: "T. Avinash Jain",
//         designation: "Partner & Mumbai Branch Head",
//         city: "Mumbai",
//         bio: "Associated since 1996. Heading Mumbai branch. Expert in Information System Audits, Audit of Media Companies, Tax representation, and Statutory Audits. Qualified Information Systems Auditor (DISA).",
//         photo: "https://images.unsplash.com/photo-1538978939284-4ecb3fc4ad5e?w=800&q=80",
//         showOnHome: false,
//         showOnTeam: true,
//         order: 5
//     }
// ];

// async function populate() {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("Connected to MongoDB...");

//         // Remove existing members to avoid duplicates for this demonstration
//         // Or you can skip this if you want to keep existing ones
//         // await TeamMember.deleteMany({});

//         for (const member of teamData) {
//             await TeamMember.findOneAndUpdate(
//                 { name: member.name },
//                 member,
//                 { upsert: true, new: true }
//             );
//             console.log(`Added/Updated: ${member.name}`);
//         }

//         console.log("Population complete!");
//         process.exit(0);
//     } catch (err) {
//         console.error("Error populating data:", err);
//         process.exit(1);
//     }
// }

// populate();
