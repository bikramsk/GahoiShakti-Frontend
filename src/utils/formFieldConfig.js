import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  EDUCATION_OPTIONS,
  OCCUPATION_OPTIONS,
  WORK_TYPES,
  INDUSTRY_SECTORS,
  HANDICAP_OPTIONS,
  BLOOD_GROUPS,
  BUSINESS_SIZES,
  EMPLOYMENT_TYPES
} from "../constants/formConstants";

export const FORM_FIELD_CONFIG = {
  personal_information: {
    gender: {
      type: "dropdown",
      options: GENDER_OPTIONS
    },
    marital_status: {
      type: "dropdown",
      options: MARITAL_STATUS_OPTIONS
    },
    blood_group: {
      type: "dropdown",
      options: BLOOD_GROUPS
    },
    nationality: {
      type: "dropdown",
      options: ["Indian", "Non-Indian"]
    },
    handicap: {
      type: "dropdown",
      options: HANDICAP_OPTIONS
    }
  },
  biographical_details: {
    gotra: {
      type: "dropdown",
      options: [
        "Vasar/Vastil/Vasal",
        "Gol",
        "Gangal / Gagil",
        "Badal / Waghil / Bandal",
        "Kocchal / Kochil",
        "Jaital",
        "Vachhil",
        "Kachhil",
        "Bhaal",
        "Kohil",
        "Kasiv",
        "Kasav",
        "Single",
        "Others"
      ]
    },
    aakna: {
      type: "dropdown",
      options: [] // This will be populated dynamically based on selected Gotra
    },
    education: {
      type: "dropdown",
      options: EDUCATION_OPTIONS
    },
    occupation: {
      type: "dropdown",
      options: OCCUPATION_OPTIONS
    }
  },
  work_information: {
    work_type: {
      type: "dropdown",
      options: WORK_TYPES
    },
    industry_sector: {
      type: "dropdown",
      options: INDUSTRY_SECTORS
    },
    business_size: {
      type: "dropdown",
      options: BUSINESS_SIZES
    },
    employment_type: {
      type: "dropdown",
      options: EMPLOYMENT_TYPES
    },
    business_type: {
      type: "dropdown",
      options: [
        "Sole Proprietorship",
        "Partnership",
        "Private Limited Company",
        "Public Limited Company",
        "Limited Liability Partnership",
        "Other"
      ]
    },
    is_married: {
      type: "dropdown",
      options: MARITAL_STATUS_OPTIONS
    }
  },
  family_details: {
    relationship_status: {
      type: "dropdown",
      options: MARITAL_STATUS_OPTIONS
    },
    marriage_community: {
      type: "dropdown",
      options: ["Same Community", "Other Community"]
    },
    children: {
      type: "array",
      fields: {
        name: { type: "text" },
        gender: {
          type: "dropdown",
          options: GENDER_OPTIONS
        },
        age: { type: "text" }
      }
    }
  }
}; 