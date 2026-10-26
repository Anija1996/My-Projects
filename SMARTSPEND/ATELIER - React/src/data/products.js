import structuredLinenBlazer from "../assets/Structured Linen Blazer.png";
import fluidSilkBlouse from "../assets/Fluid Silk Blouse.png";
import wideLegWoolTrousers from "../assets/Wide-Leg Wool Trousers.png";
import unstructuredCashmereCoat from "../assets/Unstructured Cashmere Coat.png";
import classicSilkBlouse from "../assets/Classic Silk Blouse.jpg";
import tailoredWoolTrousers from "../assets/Tailored Wool Trousers.jpg";
import cashmereKnit from "../assets/cashmere.jpg";
import leatherTote from "../assets/leather.png";
import pleatedSilkTrouser from "../assets/pleated silk trouser.png";
import tailoredWoolCoat from "../assets/tailored wool coat.png";
import cashmereTurtleneck from "../assets/cashmere turtle neck.png";
import cashmereSweater from "../assets/cashmere knit sweater.png";
import silkMidiDress from "../assets/silk midi dress.png";
import maxiDress from "../assets/maxi dress.jpg";
import sculpturalMuleHeels from "../assets/sculptural mule heals.png";
import flatSandals from "../assets/flat sandal.jpg";
import structuredLeatherTote from "../assets/structured leather tote.png";
import handPurse from "../assets/hand purse.jpg";
import pleatedSkirt from "../assets/pleated.png";
import wideLegPant from "../assets/wide leg pant.png";
import classicBlazer from "../assets/blazer.png";
import blackKnitSweater from "../assets/black sweater.jpg";
import leatherSandals from "../assets/sandal.png";
import toteBag from "../assets/tote.jpg";

export const productData = [
    {
        id: 1,
        name: "Structured Linen Blazer",
        price: 495,
        category: "Outerwear",
        image: structuredLinenBlazer,
        description: "A structured linen blazer defined by clean tailoring and understated elegance.",
        colors: ["ALABASTER", "BLACK"],
        displayColor: "ALABASTER",
        sizes: ["EU 36", "EU 38", "EU 40", "EU 42"],
        newProduct: true
    },
    {
        id: 2,
        name: "Fluid Silk Blouse",
        price: 280,
        category: "Shirts",
        image: fluidSilkBlouse,
        description: "A fluid silk blouse with a relaxed silhouette and refined finish.",
        colors: ["IVORY", "BLACK"],
        displayColor: "IVORY",
        sizes: ["EU 36", "EU 38", "EU 40"],
        newProduct: true
    },
    {
        id: 3,
        name: "Wide-Leg Wool Trousers",
        price: 340,
        category: "Jeans",
        image: wideLegWoolTrousers,
        description: "Wide-leg wool trousers designed for a polished, effortless silhouette.",
        colors: ["CHARCOAL", "BLACK"],
        displayColor: "CHARCOAL",
        sizes: ["EU 36", "EU 38", "EU 40", "EU 42"],
        newProduct: true
    },
    {
        id: 4,
        name: "Unstructured Cashmere Coat",
        price: 850,
        category: "Outerwear",
        image: unstructuredCashmereCoat,
        description: "An unstructured cashmere coat balancing softness, warmth and quiet luxury.",
        colors: ["CAMEL", "BLACK"],
        displayColor: "CAMEL",
        sizes: ["EU 36", "EU 38", "EU 40"],
        newProduct: true
    },
    {
        id: 5,
        name: "Classic Silk Blouse",
        price: 245,
        category: "Shirts",
        image: classicSilkBlouse,
        description: "A classic silk blouse with an elegant everyday silhouette.",
        colors: ["IVORY"],
        displayColor: "IVORY",
        sizes: ["EU 36", "EU 38", "EU 40"]
    },
    {
        id: 6,
        name: "Tailored Wool Trousers",
        price: 320,
        category: "Jeans",
        image: tailoredWoolTrousers,
        description: "Tailored wool trousers with a precise, timeless cut.",
        colors: ["CHARCOAL"],
        displayColor: "CHARCOAL",
        sizes: ["EU 36", "EU 38", "EU 40", "EU 42"]
    },
    {
        id: 7,
        name: "Cashmere Knit",
        price: 450,
        category: "Outerwear",
        image: cashmereKnit,
        description: "A soft cashmere knit made for understated layering.",
        colors: ["OAT", "BLACK"],
        displayColor: "OAT",
        sizes: ["S", "M", "L"]
    },
    {
        id: 8,
        name: "Leather Tote",
        price: 680,
        category: "Accessories",
        image: leatherTote,
        description: "A refined leather tote designed for everyday function.",
        colors: ["BLACK", "TAN"],
        displayColor: "BLACK",
        sizes: ["ONE SIZE"]
    },
    {
        id: 9,
        name: "Pleated Silk Trouser",
        price: 360,
        category: "Jeans",
        image: pleatedSilkTrouser,
        description: "Fluid pleated silk trousers with an elegant wide-leg silhouette.",
        colors: ["IVORY", "BLACK"],
        displayColor: "IVORY",
        sizes: ["EU 36", "EU 38", "EU 40"]
    },
    {
        id: 10,
        name: "Tailored Wool Coat",
        price: 780,
        category: "Outerwear",
        image: tailoredWoolCoat,
        description: "A tailored wool coat with a clean, timeless finish.",
        colors: ["CAMEL", "CHARCOAL"],
        displayColor: "CAMEL",
        sizes: ["EU 36", "EU 38", "EU 40"]
    },
    {
        id: 11,
        name: "Cashmere Turtleneck",
        price: 420,
        category: "Shirts",
        image: cashmereTurtleneck,
        description: "A refined cashmere turtleneck designed for effortless layering.",
        colors: ["OAT", "BLACK"],
        displayColor: "OAT",
        sizes: ["S", "M", "L"]
    },
    {
        id: 12,
        name: "Cashmere Sweater",
        price: 395,
        category: "Shirts",
        image: cashmereSweater,
        description: "A soft knit sweater with a relaxed luxury silhouette.",
        colors: ["OAT", "IVORY"],
        displayColor: "OAT",
        sizes: ["S", "M", "L"]
    },
    {
        id: 13,
        name: "Silk Midi Dress",
        price: 520,
        category: "Dresses",
        image: silkMidiDress,
        description: "A fluid silk midi dress designed with understated elegance.",
        colors: ["BLACK", "IVORY"],
        displayColor: "BLACK",
        sizes: ["EU 36", "EU 38", "EU 40"]
    },
    {
        id: 14,
        name: "Maxi Dress",
        price: 590,
        category: "Dresses",
        image: maxiDress,
        description: "An effortless maxi dress with a graceful, elongated silhouette.",
        colors: ["BLACK"],
        displayColor: "BLACK",
        sizes: ["EU 36", "EU 38", "EU 40"]
    },
    {
        id: 15,
        name: "Sculptural Mule Heels",
        price: 390,
        category: "Shoes",
        image: sculpturalMuleHeels,
        description: "Sculptural mule heels with a refined modern shape.",
        colors: ["BLACK", "TAN"],
        displayColor: "BLACK",
        sizes: ["36", "37", "38", "39", "40"]
    },
    {
        id: 16,
        name: "Flat Sandals",
        price: 240,
        category: "Shoes",
        image: flatSandals,
        description: "Minimal flat sandals designed for effortless everyday wear.",
        colors: ["TAN", "BLACK"],
        displayColor: "TAN",
        sizes: ["36", "37", "38", "39", "40"]
    },
    {
        id: 17,
        name: "Structured Leather Tote",
        price: 720,
        category: "Accessories",
        image: structuredLeatherTote,
        description: "A structured leather tote with a polished architectural form.",
        colors: ["BLACK", "TAN"],
        displayColor: "BLACK",
        sizes: ["ONE SIZE"]
    },
    {
        id: 18,
        name: "Hand Purse",
        price: 480,
        category: "Accessories",
        image: handPurse,
        description: "A compact leather hand purse with an understated finish.",
        colors: ["BLACK", "TAN"],
        displayColor: "BLACK",
        sizes: ["ONE SIZE"]
    },
    {
        id: 19,
        name: "Pleated Skirt",
        price: 310,
        category: "Dresses",
        image: pleatedSkirt,
        description: "A softly pleated skirt with an elegant flowing movement.",
        colors: ["BLACK", "IVORY"],
        displayColor: "BLACK",
        sizes: ["EU 36", "EU 38", "EU 40"]
    },
    {
        id: 20,
        name: "Wide-Leg Pant",
        price: 330,
        category: "Jeans",
        image: wideLegPant,
        description: "Wide-leg trousers with a relaxed, tailored finish.",
        colors: ["CHARCOAL", "BLACK"],
        displayColor: "CHARCOAL",
        sizes: ["EU 36", "EU 38", "EU 40", "EU 42"]
    },
    {
        id: 21,
        name: "Classic Blazer",
        price: 560,
        category: "Outerwear",
        image: classicBlazer,
        description: "A classic blazer with a clean tailored silhouette.",
        colors: ["BLACK", "CHARCOAL"],
        displayColor: "BLACK",
        sizes: ["EU 36", "EU 38", "EU 40"]
    },
    {
        id: 22,
        name: "Black Knit Sweater",
        price: 360,
        category: "Shirts",
        image: blackKnitSweater,
        description: "A versatile black knit sweater for quiet everyday dressing.",
        colors: ["BLACK"],
        displayColor: "BLACK",
        sizes: ["S", "M", "L"]
    },
    {
        id: 23,
        name: "Leather Sandals",
        price: 260,
        category: "Shoes",
        image: leatherSandals,
        description: "Minimal leather sandals with a refined everyday shape.",
        colors: ["TAN", "BLACK"],
        displayColor: "TAN",
        sizes: ["36", "37", "38", "39", "40"]
    },
    {
        id: 24,
        name: "Tote Bag",
        price: 620,
        category: "Accessories",
        image: toteBag,
        description: "An everyday tote with a spacious, timeless silhouette.",
        colors: ["TAN", "BLACK"],
        displayColor: "TAN",
        sizes: ["ONE SIZE"]
    }
];