import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronDown,
  Paperclip,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Grid,
  Box,
  FormControl,
  OutlinedInput,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import axios from "axios";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TitleIcon from "@mui/icons-material/Title";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import { loaderOff, loaderOn, openSnackbar } from "../redux/actions";
import { useNewJobForm } from "../custom-components/custom_forms/NewJobForm";
import { Theme, useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addJob, postJob } from "../services/JobService";
import { scoreResume } from "../services/ResumeService";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Backdrop from "@mui/material/Backdrop";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { getUserDetails } from "../services/UserService";
import Header from "../CommonComponents/topheader";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const containsOnlyCharacters = /\D+/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%^&*])[A-Za-z\d@$!%^&*]{10,}$/;
const regularExp = /^(?!.* {4})([a-zA-Z/]+(?: [a-zA-Z/]+){0,3})$/;

const MAX_FILE_SIZE_MB = 15;
const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]; // .docx
type Category = {
  id: number;
  category: string;
};

const primarySkills = [
  "Node.js",
  "Python",
  "Java",
  "C++",
  "C#",
  "Go (Golang)",
  "Ruby on Rails",
  "PHP",
  "JavaScript",
  "TypeScript",
  "React.js",
  "Angular",
  "Vue.js",
  "Svelte",
  "SQL (MySQL, PostgreSQL, MSSQL)",
  "MongoDB (NoSQL)",
  "Firebase",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "Google Cloud",
  "CI/CD (Jenkins, GitHub Actions, GitLab CI)",
  "Terraform",
  "TensorFlow",
  "PyTorch",
  "Scikit-learn",
  "NLP (Natural Language Processing)",
  "Computer Vision",
  "Data Science (Pandas, NumPy, Matplotlib)",
  "Swift (iOS)",
  "Kotlin (Android)",
  "Flutter",
  "React Native",
];

const secondarySkills = [
  "HTML",
  "CSS",
  "Redis",
  "PowerShell",
  "Bash",
  "Unix",
  "Linux",
  "Networking Protocols (TCP/IP, HTTP, DNS)",
  "VPNs",
  "Firewalls",
  "Penetration Testing",
  "OWASP Top 10",
  "Cryptography",
  "Wireshark",
  "Burp Suite",
];

const jobTypeNames = [
  "Full Time",
  "Part Time",
  "Contract Based",
  "Freelance",
  "Internship",
];

const modeOfWorkNames = ["Onsite", "Remote", "Hybrid"];

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

const experience = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];

const previewValuesStyle = {
  fontFamily: "SF Pro Display",
  fontWeight: 400,
  fontSize: "15px",
  lineHeight: "18.23px",
  letterSpacing: "0%",
  color: "#00000080",
};
const AIjdCreation = () => {
  const organisation = localStorage.getItem("organisation");
  const selectedLanguage: any = localStorage.getItem("i18nextLng");
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);

  const currentLanguage = selectedLanguage === "ar" ? "Arabic" : "English";
  console.log(currentLanguage);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedExperience, setSelectedExperience] = useState("");

  const [reference, setReference] = React.useState();
  const [openAccepted, setopenAccepted] = React.useState(false);

  const navigateTo = (index: any) => {
    navigate("/jdccollection", { state: { index } });
  };

  const handleExperienceChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSelectedExperience(event.target.value);
  };
  const [jobType, setJobType] = useState("");
  const [text, setText] = useState<string>("");

  const [jobTitle, setJobTitle] = useState("");
  const [keyResponsibilities, setKeyResponsibilities] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [activeTab, setActiveTab] = useState("jobTitle");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);

    // Simulate API call delay
    setTimeout(() => {
      const generatedJD = `Job Title: ${jobTitle || "Software Engineer"}

Key Responsibilities:
${
  keyResponsibilities ||
  "• Develop and maintain high-quality software applications\n• Collaborate with cross-functional teams to define and implement new features\n• Write clean, maintainable, and efficient code\n• Participate in code reviews and ensure best practices"
}

Required Skills:
${
  requiredSkills ||
  "• Bachelor's degree in Computer Science or related field\n• Proficiency in modern programming languages\n• Strong problem-solving and analytical skills\n• Excellent communication and teamwork abilities"
}

Experience Level: ${experienceLevel || "Mid-level (3-5 years)"}

Additional Requirements:
• Strong attention to detail and commitment to quality
• Ability to work in a fast-paced, collaborative environment
• Continuous learning mindset and adaptability to new technologies`;

      setJobDescription(generatedJD);
      setIsGenerating(false);
    }, 2000);
  };

  const tabStyle = (isActive: boolean) => ({
    padding: "5px 14px",
    borderRadius: "25px",
    border: "0.5px solid #0284C780",
    backgroundColor: isActive ? "#e3f2fd" : "transparent",
    color: isActive ? "#1976d2" : "#666",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    margin: "5px",
  });

  const lessMoreStyle = {
    padding: "4px 10px",
    borderRadius: "25px",
    border: "none",
    // backgroundColor: '#e3f2fd' ,
    color: "#1976d2",
    cursor: "pointer",
    fontSize: "25px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: "0 5px",
    "&:hover": {
      backgroundColor: "dodgerblue",
      color: "#fff",
      border: "1px solid dodgerblue",
    },
  };

  //divya code starts here
  const [openGeneration, setOpenGeneration] = React.useState(false);
  const handleCloseGeneration = () => {
    setOpenGeneration(false);
  };
  const handleOpenGeneration = () => {
    setOpenGeneration(true);
  };
  const [jobCategoryInput, setJobCategoryInput] = useState("");
  const [jobCategory, setJobCategory] = useState<string[]>([]);
  const [noCategoryFound, setNoCategoryFound] = useState(false);
  const [jobCategoryLoading, setJobCategoryLoading] = useState(false);
  const fetchCategories = async (keyword: string) => {
    // if (keyword.length <= 3) return

    setJobCategoryLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/category/${organisation}/search`,
        { params: { keyword } }
      );

      if (Array.isArray(res.data) && res.data.length > 0) {
        const categories = res.data.map((item: any) => item.category);
        setJobCategory(categories);
        setNoCategoryFound(false);
      } else {
        setJobCategory([]);
        setNoCategoryFound(true); // ✅ Show message
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setJobCategory([]);
      setNoCategoryFound(true); // ✅ Show message on error too
    } finally {
      setJobCategoryLoading(false);
    }
  };

  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [jobTitleAi, setJobTitleAi] = useState("");
  const [jobRoleAi, setJobRoleAi] = useState("");
  const [roleCategoryAi, setRoleCategoryAi] = useState("");
  const [experienceRequiredAi, setExperienceRequiredAi] = useState("");
  const [countryAi, setCountryAi] = useState("");
  const [stateAi, setStateAi] = useState("");
  const [cityAi, setCityAi] = useState("");
  const [modeOfWorkAi, setModeOfWorkAi] = useState("");
  // const [primarySkillsAi, setPrimarySkillsAi] = useState<string[]>([])
  const [primarySkillsAi, setPrimarySkillsAi] = useState("");
  const [secondarySkillsAi, setSecondarySkillsAi] = useState<string[]>([]);
  const [specificDomainSkillsAi, setSpecificDomainSkillsAi] = useState("");
  // const [jobTypeAi, setJobTypeAi] = useState<string[]>([])
  const [jobTypeAi, setJobTypeAi]: any = useState("");
  const [formErrorsAi, setFormErrorsAi] = useState<{ [key: string]: string }>(
    {}
  );

  const [createdBy, setCreatedBy] = useState("");
  const getUserData = async () => {
    dispatch(loaderOn());
    try {
      const res = await getUserDetails(organisation);
      console.log(res, "API Response"); // Log the entire response

      if (res.imageUrl) {
        setUserProfileImage(
          `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/user/read/downloadFile/${res.imageUrl}/${organisation}`
        );
      } else {
        setUserProfileImage(null);
      }

      // Directly access the `user_id` at the root of the response
      if (res && res.user_id !== undefined) {
        // setUserEmail(res.user_id)
        console.log(res.user_id, "User ID Found");
        setUserId(res.user_id);
        setCreatedBy(res.name);
      } else {
        console.error("Invalid response structure or missing user_id:", res);
      }
      dispatch(loaderOff());
    } catch (error) {
      console.error("Error fetching data:", error);
      dispatch(loaderOff());
    }
  };
  useEffect(() => {
    getUserData();
  }, []);

  const [showAll, setShowAll] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [stateError, setStateError] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [countryError, setCountryError] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedCountryValue, setSelectedCountryValue] = useState<string>("");
  const [selectedStateValue, setSelectedStateValue] = useState<string>("");
  const [selectedCityValue, setSelectedCityValue] = useState<string>("");
  const [countryIso2, setCountryIso2] = useState("");
  const [stateIso2, setStateIso2] = useState("");
  const apiKey = "Z1VrZk93T2RoWmdIQTc0czN0d2YyMnI2WkVvblZYSm14c3B3WWIxVg==";

  useEffect(() => {
    // Fetch countries
    axios
      .get("https://api.countrystatecity.in/v1/countries", {
        headers: { "X-CSCAPI-KEY": apiKey },
      })
      .then((response) => {
        console.log(response.data);
        // Map only the necessary keys (name and iso2)
        const formattedCountries = response.data.map((country: any) => {
          console.log(country.name + " iso = " + country.iso2);
          setCountryIso2(country.iso2);
          // setCountryPhoneCode(country.phonecode)

          // console.log(country.iso2);// Log country name
          return {
            name: country.name,
            iso2: country.iso2,
            phonecode: country.phonecode,
            emoji: country.emoji,
          };
        });
        console.log(formattedCountries.name);
        console.log(formattedCountries.iso2);
        console.log(formattedCountries.phonecode);
        setCountries(formattedCountries);
        console.log(countries);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  useEffect(() => {
    console.log("Updated Countries State:", countries);
  }, [countries]);

  // Fetch states when a country is selected

  // Fetch cities when a state is selected
  const fetchStates = (countryIso2: string) => {
    axios
      .get(
        `https://api.countrystatecity.in/v1/countries/${countryIso2}/states`,
        {
          headers: { "X-CSCAPI-KEY": apiKey },
        }
      )
      .then((response) => {
        const formattedStates = response.data.map((state: any) => ({
          name: state.name,
          iso2: state.iso2,
        }));
        setStates(formattedStates);
        setCities([]); // Clear cities when country changes
      })
      .catch((error) => console.error("Error fetching states:", error));
  };
  useEffect(() => {
    fetchStates(countryIso2);
  }, [countryIso2]);

  const fetchCities = (countryIso2: string, stateIso2: string) => {
    axios
      .get(
        `https://api.countrystatecity.in/v1/countries/${countryIso2}/states/${stateIso2}/cities`,
        { headers: { "X-CSCAPI-KEY": apiKey } }
      )
      .then((response) => {
        console.log(response.data);
        const formattedCities = response.data.map((city: any) => ({
          name: city.name,
        }));
        setCities(formattedCities);
      })
      .catch((error) => console.error("Error fetching cities:", error));
  };
  useEffect(() => {
    fetchCities(countryIso2, stateIso2);
  }, [countryIso2, stateIso2]);

  //
  const handleChangeAi = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    switch (name) {
      case "job_title":
        setJobTitleAi(value);
        break;
      case "job_role":
        setJobRoleAi(value);
        break;
      case "experience_required":
        setExperienceRequiredAi(value);
        break;
      case "role_category":
        setRoleCategoryAi(value);
        break;
      case "mode_of_work":
        setModeOfWorkAi(value);
        break;
      case "specific_domain_skills":
        setSpecificDomainSkillsAi(value);
        break;
      case "country":
        setCountryAi(value);
        break;
      case "state":
        setStateAi(value);
        break;
      case "city":
        setCityAi(value);
        break;
      default:
        break;
    }
  };

  const validateFormAi = () => {
    const errors: { [key: string]: string } = {};

    if (!jobTitleAi) errors.job_title = "Job Title is required";
    if (!jobRoleAi) errors.job_role = "Job Role is required";
    if (!experienceRequiredAi)
      errors.experience_required = "Experience is required";
    if (!roleCategoryAi) errors.role_category = "Role Category is required";
    if (jobTypeAi.length === 0)
      errors.job_type = "At least one Job Type is required";
    if (!modeOfWorkAi) errors.mode_of_work = "Mode of Work is required";

    setFormErrorsAi(errors);
    return Object.keys(errors).length === 0;
  };

  const [loading, setLoading] = useState(false);

  const submitFormAi = async () => {
    setLoading(true); // Show loader

    const MAX_SAFE_LENGTH = 50;

    const primeSkillsStr = Array.isArray(primarySkillsAi)
      ? primarySkillsAi.join(", ")
      : "";

    const secSkillsStr = Array.isArray(secondarySkillsAi)
      ? secondarySkillsAi.join(", ")
      : "";

    let specificDomainSkillsCombined = Array.isArray(specificDomainSkillsAi)
      ? specificDomainSkillsAi.join(", ")
      : "";

    const trimmedPrime = primeSkillsStr.slice(0, MAX_SAFE_LENGTH);
    const overflowPrime =
      primeSkillsStr.length > MAX_SAFE_LENGTH
        ? primeSkillsStr.slice(MAX_SAFE_LENGTH)
        : "";

    const trimmedSec = secSkillsStr.slice(0, MAX_SAFE_LENGTH);
    const overflowSec =
      secSkillsStr.length > MAX_SAFE_LENGTH
        ? secSkillsStr.slice(MAX_SAFE_LENGTH)
        : "";

    if (overflowPrime)
      specificDomainSkillsCombined +=
        (specificDomainSkillsCombined ? ", " : "") + overflowPrime;
    if (overflowSec)
      specificDomainSkillsCombined +=
        (specificDomainSkillsCombined ? ", " : "") + overflowSec;

    const payload = {
      job_title: jobTitleAi,
      job_role: formValues.job_role.value,
      experience_required: experienceRequiredAi,
      rolecategory: formValues.job_role.value,
      job_type: [jobTypeAi],
      no_of_open_positions: formValues.no_of_open_positions.value,
      // primarySkills: trimmedPrime,
      // primarySkills: primarySkillsAi,
      primarySkills: (primarySkillsAi || "").slice(0, 255),
      secondarySkills: trimmedSec,
      specificDomainSkills: specificDomainSkillsCombined,
      modeOfWork: modeOfWorkAi,
      newLocation: {
        country: selectedCountryValue,
        state: selectedStateValue,
        city: selectedCityValue,
      },
      // skills: trimmedPrime,
      // skills: primarySkillsAi,
      skills: (primarySkillsAi || "").slice(0, 255),
      location: formValues.location.value,
      createdBy: createdBy,
      job_desc_user: {
        user_id: userId,
      },
    };

    console.log("Final Payload:", payload);

    try {
      const res = await addJob(payload, organisation);
      console.log("✅ Job saved:", res.data);
      dispatch(openSnackbar("Job Description Created", "green"));
      navigate("/jdcollection");
    } catch (error) {
      console.error("❌ Error saving job:", error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const handleSaveAi = () => {
    if (validateFormAi()) {
      submitFormAi();
    }
  };

  // ✅ Unified handler for job type (multi-select as string array)
  // const handleChangeJobTypeAi = (e: SelectChangeEvent<string[]>) => {
  //   const {
  //     target: { value },
  //   } = e;
  //   setJobTypeAi(typeof value === 'string' ? value.split(',') : value);
  // };
  // ✅ Handler for single select (mode of work)
  const handleChangeJobTypeAi = (e: SelectChangeEvent) => {
    setJobTypeAi(e.target.value);
  };

  // ✅ Handler for single select (mode of work)
  const handleChangeModeOfWorkAi = (e: SelectChangeEvent) => {
    setModeOfWorkAi(e.target.value);
  };

  // ✅ Handler for experience dropdown
  const handleChangeExperienceAi = (e: SelectChangeEvent) => {
    setExperienceRequiredAi(e.target.value);
  };

  // ✅ Handler for primary skills (string input -> array)
  const handleChangePrimarySkillsAi = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = event.target.value;
    // const skillArray = inputValue.split(',').map(skill => skill.trim()).filter(Boolean);
    setPrimarySkillsAi(inputValue);
  };

  // ✅ Handler for secondary skills (string input -> array)
  const handleChangeSecondarySkillsAi = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setSecondarySkillsAi(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    );
  };

  // ✅ Handler for specific domain skills (simple string)
  const handleChangeSpecificDomainSkillsAi = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSpecificDomainSkillsAi(e.target.value);
  };

  const [address, setAddress] = useState("");
  const jobTypeTheme = useTheme();
  const modeOfWorkTheme = useTheme();
  const primarySkillTheme = useTheme();
  const secondarySkillTheme = useTheme();

  const [primarySkillForm, setPrimarySkillForm] = useState(false);
  const [secondarySkillForm, setSecondarySkillForm] = useState(false);
  const [modeOfWorkForm, setModeOfWorkForm] = useState(false);
  const [jobTypeNameForm, setJobTypeNameForm] = useState(false);
  const [jobTypeName, setJobTypeName] = React.useState<string[]>([]);
  const [modeOfWorkName, setModeOfWorkName] = React.useState<string[]>([]);
  //  const [secondarySkillName, setSecondarySkillName] = React.useState<string[]>(
  //   [],
  // )
  const [secondarySkillName, setSecondarySkillName] = React.useState("");

  // const [primarySkillName, setPrimarySkillName] = React.useState<string[]>([]
  const [primarySkillName, setPrimarySkillName] = React.useState("");

  // const [specificDomainSkill, setSpecificDomainSkill] = React.useState<
  //   string[]
  // >([])
  const [specificDomainSkill, setSpecificDomainSkill] = React.useState("");
  const [specificDomainSkillForm, setSpecificDomainSkillForm] = useState(false);

  const handleChangePrimarySkills = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;

    // Convert comma-separated values into an array
    const selectedValues = value.split(",").map((item) => item.trim());

    // setPrimarySkillName(selectedValues)
    setPrimarySkillName(value);

    // Remove error message when user types at least one skill
    setPrimarySkillForm(selectedValues.length === 0);
  };

  const handleChangeSecondarySkills = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;

    // Convert comma-separated values into an array
    const selectedValues = value.split(",").map((item) => item.trim());

    // setSecondarySkillName(selectedValues)
    setSecondarySkillName(value);

    // Remove error message when user types at least one skill
    setSecondarySkillForm(selectedValues.length === 0);
  };

  const handleChangeSpecificDomainSkills = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;

    // Convert comma-separated values into an array
    const selectedValues = value.split(",").map((item) => item.trim());

    // setSpecificDomainSkill(selectedValues)
    setSpecificDomainSkill(value);

    // Remove error message when user types at least one skill
    setSpecificDomainSkillForm(selectedValues.length === 0);
  };

  const handleChangeJobTypeNames = (
    event: SelectChangeEvent<typeof jobTypeName>
  ) => {
    const {
      target: { value },
    } = event;
    const selectedValues = typeof value === "string" ? value.split(",") : value;
    setJobTypeName(selectedValues);
    if (selectedValues.length > 0) {
      setJobTypeNameForm(false);
    } else {
      setJobTypeNameForm(true);
    }
  };

  const handleChangeModeOfWork = (
    event: SelectChangeEvent<typeof modeOfWorkName>
  ) => {
    const {
      target: { value },
    } = event;
    const selectedValues = typeof value === "string" ? value.split(",") : value;
    setModeOfWorkName(selectedValues);
    if (selectedValues.length > 0) {
      setModeOfWorkForm(false);
    } else {
      setModeOfWorkForm(true);
    }
  };

  //file upload code..
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 1. Validate file type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      alert("Only PDF or DOCX files are allowed.");
      return;
    }

    // 2. Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      alert(`File too large. Max size allowed is ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    // 3. Upload to server
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/api/upload`,
         formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadedFileName(file.name);
      setUploadSuccess(true);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload file.");
      setUploadedFileName(null);
      setUploadSuccess(false);
    }
  };

  /// dropdown select code

  const [categoryInputValue, setCategoryInputValue] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categorySelected, setCategorySelected] = useState<Category | null>(
    null
  );

  const handleCategoryInputChange = async (event: any, value: string) => {
    setCategoryInputValue(value);

    if (value.length >= 3) {
      setCategoryLoading(true);
      try {
        const response = await axios.get<Category[]>(
          `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/category/iosys/search?keyword=${value}`
        );
        setCategoryOptions(response.data);
      } catch (err) {
        setCategoryOptions([]);
      } finally {
        setCategoryLoading(false);
      }
    } else {
      setCategoryOptions([]);
    }
  };

  //preview code
  const [openPreview, setOpenPreview] = React.useState(false);
  const [scrollPreview, setScrollPreview] =
    React.useState<DialogProps["scroll"]>("paper");

  const handleClickOpenPreview = (scrollType: DialogProps["scroll"]) => () => {
    setOpenPreview(true);
    setScrollPreview(scrollType);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (openPreview) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [openPreview]);

  // hjhj
  const { formValues, setFormValues } = useNewJobForm();

  const [selectedRole, setSelectedRole] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [isFormComplete, setIsFormComplete] = useState(false);

  const [showJobTitle, setShowJobTitle] = useState(false);
  const [visibleSections, setVisibleSections] = useState({
    job_title: false,
    job_role: false,
    job_type: false,
    no_of_open_positions: false,
    mode_of_work: false,
    primary_skills: false,
    secondary_skills: false,
    experience_required: false,
    // country: false,
    // state: false,
    // city: false,
    location: false,
    domain_skills: false,
    job_description: false,
  });

  const toggleSection = (sectionName: keyof typeof visibleSections) => {
    setVisibleSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault(); // Enables normal drag cursor instead of 🚫
    };

    window.addEventListener("dragover", handleDragOver);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
    };
  }, []);

  const [openPreviewAijd, setOpenPreviewAijd] = React.useState(false);

  const handleOpenPreviewAijd = () => setOpenPreviewAijd(true);
  const handleClosePreviewAijd = () => setOpenPreviewAijd(false);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const MAX_ACTIVE_JOBS = 30;
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);

  const [toneData, setToneData] = React.useState([
    {
      name: "Job_type",
      tone: [
        { value: "Full Time", selected: false },
        { value: "Part Time", selected: false },
        { value: "Remote", selected: false },
        { value: "Internship", selected: false },
        { value: "Freelance", selected: false },
        { value: "Hybrid", selected: false },
        { value: "Contract to Hire", selected: false },
        { value: "Contract", selected: false },
      ],
      selectedValue: "",
    },
  ]);

  const handleSkillSelect = (role: string, selectedSkill: string) => {
    const updatedToneData = toneData.map((category: any) => {
      if (category.name === "Job_type") {
        category.tone = category.tone.map((skill: any) => {
          return {
            ...skill,
            selected: skill.value === selectedSkill,
          };
        });
      }
      return category;
    });

    setToneData(updatedToneData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // If value is already present, remove the error
    if (name === "job_title") {
      // if (formValues.job_title.value && value.trim() !== '') {
      setFormValues((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          value,
          error: false, // Remove error if a value is already present
        },
      }));
      return;
      // }

      // Validate only if value is entered
      const isValidJobTitle = regularExp.test(value);
      setFormValues((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          value,
          error: !isValidJobTitle, // Set error only if invalid
        },
      }));
    } else if (name === "job_role") {
      // if (formValues.job_role.value && value.trim() !== '') {
      setFormValues((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          value,
          error: false,
        },
      }));
      return;
      // }

      const isValidJobRole = regularExp.test(value);
      setFormValues((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          value,
          error: !isValidJobRole,
        },
      }));
    } else if (name === "no_of_open_positions") {
      // Allow only digits
      const numericValue = value.replace(/[^0-9]/g, "");

      setFormValues((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          value: numericValue,
          error: numericValue.trim() === "",
        },
      }));
      return;
    } else {
      setFormValues((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          value,
          error: value.trim() === "", // Only show error if field is empty
        },
      }));
    }
  };
  const validateForm = (type: any) => {
    let invalidSubmit = false;

    const job_title: any = formValues.job_title.value;

    const formFields = Object.keys(formValues);
    let newFormValues = { ...formValues };
    for (let index = 0; index < formFields.length; index++) {
      const currentField = formFields[index];
      const currentValue = formValues[currentField].value;
      if (type == "sign-in") {
        if (currentValue === "") {
          newFormValues = {
            ...newFormValues,
            [currentField]: {
              ...newFormValues[currentField],
              error: true,
            },
          };
        }
      }
    }
    setFormValues(newFormValues);
    Object.values(newFormValues).every((number: any) => {
      if (number.error) {
        invalidSubmit = number.error;
        dispatch(loaderOff());
        return false;
      }
    });
    if (
      primarySkillName.length === 0 &&
      secondarySkillName.length === 0 &&
      modeOfWorkName.length === 0 &&
      jobTypeName.length === 0 &&
      specificDomainSkill.length === 0
      //   specificDomainSkillForm === true
    ) {
      setPrimarySkillForm(true);
      setSecondarySkillForm(true);
      setModeOfWorkForm(true);
      setJobTypeNameForm(true);
      setSpecificDomainSkillForm(true);
      invalidSubmit = true;
      return false;
    }

    dispatch(loaderOff());
    return invalidSubmit;
  };
  const [activeJobCount, setActiveJobCount] = useState(0);
  const [draftJobCount, setDraftJobCount] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  //  const handleGenerateAijd = async () => {
  //     console.log('Executing handleConfirm ai')
  //     setFormSubmitted(true)
  // setShowButtons(false)
  //     if (isSubmitting) {
  //       console.log('Already submitting, exiting...')
  //       return
  //     }

  //     if (activeJobCount >= MAX_ACTIVE_JOBS) {
  //       dispatch(
  //         openSnackbar(
  //           'You have reached maximum limit'+{ maxJobs: MAX_ACTIVE_JOBS },
  //           'red',
  //         ),
  //       )
  //       return
  //     }

  //     const selectedJobTypes = toneData?.[0]?.tone?.some(
  //       (skill) => skill.selected,
  //     )

  //     const invalidSubmit = validateForm('sign-in')

  //     console.log({
  //       invalidSubmit,
  //       job_title: formValues.job_title.value,
  //       job_role: formValues.job_role.value,
  //       experience_required: formValues.experience_required.value,
  //       primarySkillName,
  //       jobTypeName,
  //       specificDomainSkill,
  //     })
  //     if (selectedCountryValue == '' && selectedCityValue == '') {
  //       setLocationError(true)
  //     }
  //     if (specificDomainSkill.length == 0) {
  //       setSpecificDomainSkillForm(true)
  //     }
  //     if (
  //       !invalidSubmit &&
  //       !locationError &&
  //       formValues.job_title.value &&
  //       formValues.job_role.value &&
  //       formValues.experience_required.value &&
  //       // formValues.location.value &&
  //       primarySkillName.length !== 0 &&
  //       secondarySkillName.length !== 0 &&
  //       modeOfWorkName.length !== 0 &&
  //       // formValues.skills.value &&
  //       // formValues.company_name.value &&
  //       // selectedJobTypes &&
  //       selectedCountryValue &&
  //       selectedStateValue &&
  //       jobTypeName.length !== 0 &&
  //       specificDomainSkill.length !== 0 &&
  //       specificDomainSkillForm == false
  //       // && editorState.getCurrentContent().hasText() &&
  //       // textValue.trim() !== ''
  //     ) {
  //       // setAllFieldsFilled(true)
  //       // setIsSubmitting(true)
  //       handleOpenGeneration()
  //       // dispatch(loaderOn())
  //       // setIsFormComplete(true)

  //       // const skillsString = primarySkillName.join(', ')
  //       // const secondarySkillsString = secondarySkillName.join(', ')
  //       // const specificDomainString = Array.isArray(specificDomainSkill)
  //       //   ? specificDomainSkill.join(',')
  //       //   : ''

  //       const modeOfWorkString = modeOfWorkName.join(', ')

  //       const data = {
  //         job_title: formValues.job_title.value,
  //         job_role: formValues.job_role.value,
  //         experience_required: formValues.experience_required.value,
  //         // location: formValues.location.value,
  //         language_selected: selectedLanguage,
  //         rolecategory: formValues.job_role.value,
  //         // skills: skillsString,
  //         // primary_skills: skillsString,
  //         primary_skills: primarySkillName,
  //         // secondary_skills: secondarySkillsString,
  //         secondary_skills: secondarySkillName,
  //         domain_specific: specificDomainSkill,
  //         mode_of_work: modeOfWorkString,
  //         job_type: jobTypeName.join(', '),
  //         jd_category: formValues.job_role.value,
  //         //salary extra need to be added

  //         location: {
  //           country: selectedCountryValue,
  //           state: selectedStateValue,
  //           city: selectedCityValue,
  //         },
  //       }
  //       dispatch(openSnackbar('Please wait until JD being generated..', 'dodgerblue'))
  //       try {
  //         const response = await axios.post(
  //           `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/generate_job_description/`,
  //           { jd_info: data },
  //           { headers: { 'Content-Type': 'application/json' } },
  //         )

  //         console.log('Generated Job Description:', response.data)
  //         const jobDescription = response.data

  //         const extractResponse = await axios.post(
  //           `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/extract-job-description/`,
  //           { job_description: jobDescription },
  //           {
  //             headers: {
  //               'Content-Type': 'application/json',
  //               Organization: organisation, // Passing Organization in headers
  //             },
  //           },
  //         )

  //         console.log('Extracted Job Description:', extractResponse.data)
  //         const extractedData = extractResponse.data
  //         console.log(extractedData.location.city)
  //         console.log(extractedData.location.state)
  //         console.log(extractedData.location.country)

  //         //
  //         console.log('Job Title:', extractedData.job_title)
  //         console.log('Job Role:', extractedData.job_role)
  //         console.log('Role Category:', extractedData.job_role)
  //         console.log('Experience Required:', extractedData.experience_required)
  //         console.log('Country:', extractedData.location?.country)
  //         console.log('State:', extractedData.location?.state)
  //         console.log('City:', extractedData.location?.city)
  //         console.log('Mode of Work:', extractedData.mode_of_work)
  //         console.log('Primary Skills:', extractedData.primary_skills?.join(', '))
  //         console.log(
  //           'Secondary Skills:',
  //           extractedData.secondary_skills?.join(', '),
  //         )
  //         console.log(
  //           'Specific Domain Skills:',
  //           extractedData.domain_specific?.join(', '),
  //         )
  //         console.log('Job Type:', extractedData.job_type)
  //         //
  //         setJobTitleAi(extractedData.job_title || '')
  //         setJobRoleAi(extractedData.job_role || '')
  //         setRoleCategoryAi(extractedData.job_role || '')
  //         setExperienceRequiredAi(extractedData.experience_required || '')
  //         setCountryAi(extractedData.location?.country || '')
  //         setStateAi(extractedData.location?.state || '')
  //         setCityAi(extractedData.location?.city || '')
  //         setModeOfWorkAi(extractedData.mode_of_work || '')
  //         setPrimarySkillsAi(extractedData.primary_skills?.join(', ') || '')
  //         setSecondarySkillsAi(extractedData.secondary_skills?.join(', ') || '')
  //         setSpecificDomainSkillsAi(
  //           extractedData.domain_specific?.join(', ') || '',
  //         )
  //         setJobTypeAi([extractedData.job_type || ''])

  //         console.log('Ai Title =', jobTitleAi)
  //         console.log('Ai Role =', jobRoleAi)
  //         console.log('Ai Role Category =', roleCategoryAi)
  //         console.log('Ai Experience Required =', experienceRequiredAi)
  //         console.log('Ai Country =', countryAi)
  //         console.log('Ai State =', stateAi)
  //         console.log('Ai City =', cityAi)
  //         console.log('Ai Mode of Work =', modeOfWorkAi)
  //         console.log('Ai Primary Skills =', primarySkillsAi)
  //         console.log('Ai Secondary Skills =', secondarySkillsAi)
  //         console.log('Ai Specific Domain Skills =', specificDomainSkillsAi)
  //         console.log('Ai Job Type =', jobTypeAi)
  //         dispatch(openSnackbar('Jd Generated Successfully', 'green'))
  // setShowButtons(true)
  //         handleOpenPreviewAijd()
  //         // dispatch(loaderOff())
  //       } catch (error) {
  //         console.error('API error:', error)
  //       }
  //     }
  //     else{
  //               dispatch(openSnackbar('Please fill all the fields', 'red'))
  //     }
  //   }
  const handleGenerateAijd = async () => {
    setIsAnimated(false);
    console.log("Executing handleConfirm ai");
    setFormSubmitted(true);
    setShowButtons(false);

    if (isSubmitting) {
      console.log("Already submitting, exiting...");
      return;
    }

    if (activeJobCount >= MAX_ACTIVE_JOBS) {
      dispatch(
        openSnackbar(
          "You have reached maximum limit" + { maxJobs: MAX_ACTIVE_JOBS },
          "red"
        )
      );
      return;
    }

    const selectedJobTypes = toneData?.[0]?.tone?.some(
      (skill) => skill.selected
    );

    const invalidSubmit = validateForm("sign-in");

    console.log({
      invalidSubmit,
      job_title: formValues.job_title.value,
      job_role: formValues.job_role.value,
      experience_required: formValues.experience_required.value,
      primarySkillName,
      jobTypeName,
      specificDomainSkill,
    });

    if (selectedCountryValue == "" && selectedCityValue == "") {
      setLocationError(true);
    }
    if (specificDomainSkill.length == 0) {
      setSpecificDomainSkillForm(true);
    }

    if (
      !invalidSubmit &&
      !locationError &&
      formValues.job_title.value &&
      formValues.job_role.value &&
      formValues.experience_required.value &&
      primarySkillName.length !== 0 &&
      secondarySkillName.length !== 0 &&
      modeOfWorkName.length !== 0 &&
      selectedCountryValue &&
      selectedStateValue &&
      jobTypeName.length !== 0 &&
      specificDomainSkill.length !== 0 &&
      specificDomainSkillForm == false
    ) {
      handleOpenGeneration();

      const modeOfWorkString = modeOfWorkName.join(", ");

      // Store original user inputs for fallback
      const originalUserInputs = {
        job_title: formValues.job_title.value,
        job_role: formValues.job_role.value,
        experience_required: formValues.experience_required.value,
        language_selected: selectedLanguage,
        rolecategory: formValues.job_role.value,
        primary_skills: primarySkillName,
        secondary_skills: secondarySkillName,
        domain_specific: specificDomainSkill,
        mode_of_work: modeOfWorkString,
        job_type: jobTypeName.join(", "),
        jd_category: formValues.job_role.value,
        location: {
          country: selectedCountryValue,
          state: selectedStateValue,
          city: selectedCityValue,
        },
      };

      const data = {
        job_title: formValues.job_title.value,
        job_role: formValues.job_role.value,
        experience_required: formValues.experience_required.value,
        language_selected: selectedLanguage,
        rolecategory: formValues.job_role.value,
        primary_skills: primarySkillName,
        secondary_skills: secondarySkillName,
        domain_specific: specificDomainSkill,
        mode_of_work: modeOfWorkString,
        job_type: jobTypeName.join(", "),
        jd_category: formValues.job_role.value,
        location: {
          country: selectedCountryValue,
          state: selectedStateValue,
          city: selectedCityValue,
        },
      };

      dispatch(
        openSnackbar("Please wait until JD being generated..", "dodgerblue")
      );

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/generate_job_description/`,
          { jd_info: data },
          { headers: { "Content-Type": "application/json" } }
        );

        console.log("Generated Job Description:", response.data);
        const jobDescription = response.data;

        const extractResponse = await axios.post(
          `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/extract-job-description/`,
          { job_description: jobDescription },
          {
            headers: {
              "Content-Type": "application/json",
              Organization: organisation,
            },
          }
        );

        console.log("Extracted Job Description:", extractResponse.data);
        const extractedData = extractResponse.data;
        if (extractResponse.status === 200) {
          setIsAnimated(true);
        }

        // Helper function to get value with fallback
        const getValueWithFallback = (aiValue: any, originalValue: any) => {
          // Check if AI value exists and is not empty
          if (aiValue !== undefined && aiValue !== null && aiValue !== "") {
            // For arrays, check if they have elements
            if (Array.isArray(aiValue) && aiValue.length > 0) {
              return aiValue;
            }
            // For strings and numbers
            if (!Array.isArray(aiValue)) {
              return aiValue;
            }
          }
          // Return original value as fallback
          return originalValue;
        };

        // Auto-fill with fallback logic
        setJobTitleAi(
          getValueWithFallback(
            extractedData.job_title,
            originalUserInputs.job_title
          ) || ""
        );

        setJobRoleAi(
          getValueWithFallback(
            extractedData.job_role,
            originalUserInputs.job_role
          ) || ""
        );

        setRoleCategoryAi(
          getValueWithFallback(
            extractedData.job_role,
            originalUserInputs.rolecategory
          ) || ""
        );

        setExperienceRequiredAi(
          getValueWithFallback(
            extractedData.experience_required,
            originalUserInputs.experience_required
          ) || ""
        );

        // Handle location with fallback
        setCountryAi(
          getValueWithFallback(
            extractedData.location?.country,
            originalUserInputs.location.country
          ) || ""
        );

        setStateAi(
          getValueWithFallback(
            extractedData.location?.state,
            originalUserInputs.location.state
          ) || ""
        );

        setCityAi(
          getValueWithFallback(
            extractedData.location?.city,
            originalUserInputs.location.city
          ) || ""
        );

        setModeOfWorkAi(
          getValueWithFallback(
            extractedData.mode_of_work,
            originalUserInputs.mode_of_work
          ) || ""
        );

        // Handle skills arrays - join with comma if it's an array, otherwise use as string
        const primarySkillsValue = getValueWithFallback(
          extractedData.primary_skills,
          originalUserInputs.primary_skills
        );
        setPrimarySkillsAi(
          Array.isArray(primarySkillsValue)
            ? primarySkillsValue.join(", ")
            : primarySkillsValue || ""
        );

        const secondarySkillsValue = getValueWithFallback(
          extractedData.secondary_skills,
          originalUserInputs.secondary_skills
        );
        setSecondarySkillsAi(
          Array.isArray(secondarySkillsValue)
            ? secondarySkillsValue.join(", ")
            : secondarySkillsValue || ""
        );

        const domainSpecificValue = getValueWithFallback(
          extractedData.domain_specific,
          originalUserInputs.domain_specific
        );
        setSpecificDomainSkillsAi(
          Array.isArray(domainSpecificValue)
            ? domainSpecificValue.join(", ")
            : domainSpecificValue || ""
        );

        // Handle job type
        // const jobTypeValue = getValueWithFallback(
        //   extractedData.job_type,
        //   originalUserInputs.job_type
        // )
        setJobTypeAi(
          (originalUserInputs.job_type)|| ''
        )
        // const normalizedJobType = getValueWithFallback(
        //   extractedData.job_type,
        //   originalUserInputs.job_type
        // )?.trim();

        // const formattedJobType =
        //   normalizedJobType
        //     ?.toLowerCase()
        //     .replace(/\b\w/g, (char: any) => char.toUpperCase()) || "";

        // setJobTypeAi(formattedJobType);

        // Log the final values being set
        console.log("=== FINAL VALUES BEING SET ===");
        console.log(
          "Job Title:",
          getValueWithFallback(
            extractedData.job_title,
            originalUserInputs.job_title
          )
        );
        console.log(
          "Job Role:",
          getValueWithFallback(
            extractedData.job_role,
            originalUserInputs.job_role
          )
        );
        console.log(
          "Experience:",
          getValueWithFallback(
            extractedData.experience_required,
            originalUserInputs.experience_required
          )
        );
        console.log(
          "Country:",
          getValueWithFallback(
            extractedData.location?.country,
            originalUserInputs.location.country
          )
        );
        console.log(
          "State:",
          getValueWithFallback(
            extractedData.location?.state,
            originalUserInputs.location.state
          )
        );
        console.log(
          "City:",
          getValueWithFallback(
            extractedData.location?.city,
            originalUserInputs.location.city
          )
        );
        console.log(
          "Mode of Work:",
          getValueWithFallback(
            extractedData.mode_of_work,
            originalUserInputs.mode_of_work
          )
        );
        console.log("Primary Skills:", primarySkillsValue);
        console.log("Secondary Skills:", secondarySkillsValue);
        console.log("Domain Skills:", domainSpecificValue);
        // console.log('Job Type:', jobTypeValue)

        dispatch(openSnackbar("JD Generated Successfully", "green"));
        setShowButtons(true);
        handleOpenPreviewAijd();
      } catch (error) {
        console.error("API error:", error);
        dispatch(openSnackbar("Error generating JD. Please try again.", "red"));
        setShowButtons(true);
      }
    } else {
      dispatch(openSnackbar("Please fill all the fields", "red"));
    }
  };

  const handleDraftAijd = async () => {
    const data = {
      job_title: jobTitleAi,
      job_role: jobRoleAi,
      experience_required: experienceRequiredAi,
      location: formValues.location.value,
      rolecategory: jobRoleAi,

      // skills: formValues.skills.value,
      skills: primarySkillsAi,
      primarySkills: primarySkillsAi,
      secondarySkills: secondarySkillsAi,
      // company_name: formValues.company_name.value,
      // job_type: selectedJobTypes,
      specificDomainSkills: specificDomainSkillsAi,
      modeOfWork: modeOfWorkAi,
      job_type: jobTypeAi,
      // job_description: textValue,
      newLocation: {
        country: countryAi,
        state: stateAi,
        city: cityAi,
      },
      job_desc_user: {
        user_id: userId,
      },
    };

    try {
      const res = await postJob(data, organisation);
      navigateTo(0);
      dispatch(loaderOff());
    } catch (error) {
      navigateTo(0);
      dispatch(loaderOff());
      console.log(error);
    }
    setIsSubmitting(false);
    setJobType("draft");
  };
  const handleConfirmsAijd = async () => {
    console.log("Executing handleConfirm ai");
    setFormSubmitted(true);

    if (isSubmitting) {
      console.log("Already submitting, exiting...");
      return;
    }

    if (activeJobCount >= MAX_ACTIVE_JOBS) {
      dispatch(
        openSnackbar(
          "You have reached the maximum limit " + { maxJobs: MAX_ACTIVE_JOBS },
          "red"
        )
      );
      return;
    }

    const selectedJobTypes = toneData?.[0]?.tone?.some(
      (skill) => skill.selected
    );
    // if (editorState.getCurrentContent().hasText() || textValue.trim() !== '') {
    //   // setIsSubmitting(true)
    //   // dispatch(loaderOn())
    //   // setIsFormComplete(true)
    // } else {
    //   setError('Please Add job description')
    //   // setError(t('addJobDescriptionError'))
    // }

    const invalidSubmit = validateForm("sign-in");

    console.log({
      invalidSubmit,
      job_title: formValues.job_title.value,
      job_role: formValues.job_role.value,
      experience_required: formValues.experience_required.value,
      primarySkillName,
      jobTypeName,
      specificDomainSkill,
    });
    if (selectedCountryValue == "" && selectedCityValue == "") {
      setLocationError(true);
    }
    if (specificDomainSkill.length == 0) {
      setSpecificDomainSkillForm(true);
    }
    if (
      !invalidSubmit &&
      !locationError &&
      formValues.job_title.value &&
      formValues.job_role.value &&
      formValues.experience_required.value &&
      // formValues.location.value &&
      primarySkillName.length !== 0 &&
      secondarySkillName.length !== 0 &&
      modeOfWorkName.length !== 0 &&
      selectedCountryValue &&
      selectedStateValue &&
      jobTypeName.length !== 0 &&
      specificDomainSkill.length !== 0 &&
      specificDomainSkillForm == false
    ) {
      setAllFieldsFilled(true);
      setIsSubmitting(true);
      dispatch(loaderOn());
      setIsFormComplete(true);

      // const skillsString = primarySkillName.join(', ')
      // const secondarySkillsString = secondarySkillName.join(', ')

      // const specificDomainString = Array.isArray(specificDomainSkill)
      //   ? specificDomainSkill.join(',')
      //   : ''

      const modeOfWorkString = modeOfWorkName.join(", ");

      const data = {
        job_title: formValues.job_title.value,
        job_role: formValues.job_role.value,
        experience_required: formValues.experience_required.value,
        // location: formValues.location.value,

        rolecategory: formValues.job_role.value,
        // skills: skillsString,
        // primary_skills: skillsString,
        primary_skills: primarySkillName,
        // secondary_skills: secondarySkillsString,
        secondary_skills: secondarySkillName,
        // domain_specific: specificDomainString,
        domain_specific: specificDomainSkill,
        mode_of_work: modeOfWorkString,
        job_type: jobTypeName.join(", "),
        jd_category: formValues.job_role.value,
        location: {
          country: selectedCountryValue,
          state: selectedStateValue,
          city: selectedCityValue,
        },
      };

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/generate_job_description/`,
          { jd_info: data },
          { headers: { "Content-Type": "application/json" } }
        );

        console.log("Generated Job Description:", response.data);
        const jobDescription = response.data;

        const extractResponse = await axios.post(
          `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/extract-job-description/`,
          { job_description: jobDescription },
          {
            headers: {
              "Content-Type": "application/json",
              Organization: organisation, // Passing Organization in headers
            },
          }
        );

        console.log("Extracted Job Description:", extractResponse.data);
        const extractedData = extractResponse.data;
        console.log(extractedData.location.city);
        console.log(extractedData.state);
        console.log(extractedData.country);

        setJobTitleAi(extractedData.job_title || "");
        setJobRoleAi(extractedData.job_role || "");
        setRoleCategoryAi(extractedData.job_role || "");
        setExperienceRequiredAi(extractedData.experience_required || "");
        setCountryAi(extractedData.location?.country || "");
        setStateAi(extractedData.location?.state || "");
        setCityAi(extractedData.location?.city || "");
        setModeOfWorkAi(extractedData.mode_of_work || "");
        setPrimarySkillsAi(extractedData.primary_skills?.join(", ") || "");
        setSecondarySkillsAi(extractedData.secondary_skills?.join(", ") || "");
        setSpecificDomainSkillsAi(
          extractedData.domain_specific?.join(", ") || ""
        );
        // setJobTypeAi([extractedData.job_type || ''])
        setJobTypeAi(extractedData.job_type || "");

        const newJobEntity = {
          job_title: extractedData.job_title || "",
          job_role: extractedData.job_role || "",
          rolecategory: extractedData.job_role || "",
          experience_required: extractedData.experience_required || "",
          newLocation: {
            country: extractedData.location.country || "",
            state: extractedData.location.state || "",
            city: extractedData.location.city || "",
          },
          modeOfWork: extractedData.mode_of_work || "",
          // primarySkills: extractedData.primary_skills?.join(", ") || "",
          primarySkills:
            extractedData.primary_skills?.join(", ").slice(0, 2000) || "",

          secondarySkills: extractedData.secondary_skills?.join(", ") || "",
          specificDomainSkills: extractedData.domain_specific?.join(", ") || "",

          job_type: [extractedData.job_type || ""],
          job_desc_user: {
            user_id: userId,
          },
        };

        console.log("Executing with:", newJobEntity);
        try {
          const res = await addJob(newJobEntity, organisation);
          dispatch(loaderOff());

          const handleJdCreation = async () => {
            const data = {
              skills: res.skills,
              location: res.location,
              designation: res.job_role,
              exp: res.experience_required,
              jd_id: String(res.jobid),
              // created_by: userEmail,
            };
            try {
              const response = await scoreResume(data); // Using scoreResume function instead of axios.post
              dispatch(loaderOff());
            } catch (error) {
              console.error("Request error:", error);
              dispatch(loaderOff());
            }
          };

          await handleJdCreation();
          const referenceNumber = res.referenceNumber;
          setReference(referenceNumber);
          setopenAccepted(true);
          formValues.job_title.value = "";
          formValues.job_role.value = "";
          formValues.experience_required.value = "";
          formValues.location.value = "";
          formValues.skills.value = "";
          formValues.company_name.value = "";
          // navigateTo('yes')
          dispatch(
            openSnackbar(
              `Job Role Created Successfully, Reference No: ${referenceNumber}`,
              "green"
            )
          ),
            navigateTo(0);
          dispatch(loaderOff());
        } catch (error) {
          dispatch(loaderOff());
          console.error("Error in adding data:", error);

          navigateTo(0);
          dispatch(loaderOff());
        }
        setIsSubmitting(false);

        setJobType("active");
      } catch (error) {
        console.error("API error:", error);
      }
    }
  };

  return (
    <div
      style={{
        padding: "10px 10px 0px 10px",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #f0f7ff 100%)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <Header
        title="Create JD"
        userProfileImage={userProfileImage}
        path="/AIJDCreator"
      />

      <Grid
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#1976d2",
            textAlign: "center",
            // marginBottom: '15px',
            background: "linear-gradient(135deg, #1976d2, #21cbf3)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Hire Smarter with AI-Powered JD Creation
        </Box>
      </Grid>
      <Box
        style={{
          fontSize: "16px",
          color: "#666",
          // maxWidth: '600px',
          margin: "0 auto",
          textAlign: "center",
          padding: "0px",
        }}
      >
        Just tell me about the role, and I &apos;ll generate a professional,
        tailored JD for you instantly.
      </Box>
      {/* Main Content */}
      <div style={{}}>
        {/* Title Section */}
        <div style={{ marginBottom: "10px" }}></div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "5px",
            flexWrap: "wrap",
          }}
        >
          <button
            id="btnJobTitle"
            draggable={true}
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", "dragging-job-title");
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragEnd={() => toggleSection("job_title")}
            style={tabStyle(activeTab === "jobTitle")}
          >
            🧾 Job Title
          </button>

          <button
            id="btnJobRole"
            draggable={true}
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", "dragging-job-role");
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragEnd={() => toggleSection("job_role")}
            style={tabStyle(activeTab === "job_role")}
          >
            👤 Job Role
          </button>

          <button
            id="btnJobType"
            draggable={true}
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", "dragging-job-type");
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragEnd={() => toggleSection("job_type")}
            style={tabStyle(activeTab === "job_type")}
          >
            💼 Job Type
          </button>

          <button
            id="btnNoOfOpenPositions"
            draggable={true}
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", "dragging-mode-of-work");
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragEnd={() => toggleSection("no_of_open_positions")}
            style={tabStyle(activeTab === "no_of_open_positions")}
          >
            📌 Open Positions
          </button>

          <button
            id="btnModeOfWork"
            draggable={true}
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", "dragging-mode-of-work");
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragEnd={() => toggleSection("mode_of_work")}
            style={tabStyle(activeTab === "mode_of_work")}
          >
            🏠 Mode Of Work
          </button>

          <button
            id="btnExperienceRequired"
            draggable={true}
            onDragStart={(e) => {
              e.dataTransfer.setData(
                "text/plain",
                "dragging-experience-required"
              );
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragEnd={() => toggleSection("experience_required")}
            style={tabStyle(activeTab === "experience_required")}
          >
            🎯 Experience Level
          </button>
          {!showAll ? (
            <button
              onClick={() => setShowAll(true)}
              style={{
                ...lessMoreStyle,
              }}
            >
              <KeyboardDoubleArrowRightIcon sx={{ fontSize: "40px" }} />
            </button>
          ) : (
            <>
              <button
                id="btnPrimarySkills"
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    "text/plain",
                    "dragging-primary-skills"
                  );
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragEnd={() => toggleSection("primary_skills")}
                style={tabStyle(activeTab === "primary_skills")}
              >
                🛠️ Primary Skills
              </button>

              <button
                id="btnSecondarySkills"
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    "text/plain",
                    "dragging-secondary-skills"
                  );
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragEnd={() => toggleSection("secondary_skills")}
                style={tabStyle(activeTab === "secondary_skills")}
              >
                ⚙️ Secondary Skills
              </button>

              <button
                id="btnLocation"
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", "dragging-country");
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragEnd={() => toggleSection("location")}
                style={tabStyle(activeTab === "location")}
              >
                📍 Location
              </button>

              <button
                id="btnDomainSkills"
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    "text/plain",
                    "dragging-domain-skills"
                  );
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragEnd={() => toggleSection("domain_skills")}
                style={tabStyle(activeTab === "domain_skills")}
              >
                🧠 Specific Domain Skills
              </button>

              <button
                onClick={() => setShowAll(false)}
                style={{
                  ...lessMoreStyle,
                }}
              >
                <KeyboardDoubleArrowLeftIcon sx={{ fontSize: "40px" }} />
              </button>
            </>
          )}
        </div>

        <div
          style={{
            backgroundColor: "rgba(255, 235, 59, 0.1)",
            border: "1px solid rgba(255, 235, 59, 0.3)",
            borderRadius: "12px",
            padding: "3px",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "16px" }}>💡</span>
          <span style={{ color: "#666", fontSize: "14px" }}>
            <strong>Pro Tip:</strong> You can drag any card to the canvas or
            start typing freely.
          </span>
        </div>

        {/* Input Area */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "20px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            marginBottom: "5px",
            minHeight: "100px",
            // minHeight: '400px',
          }}
        >
          <Grid id="selectedItems" container spacing={2}>
            {/* job tile */}
            {!visibleSections.job_title && (
              <Grid id="job_title" item xs={12} sm={6} md={4} lg={3}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      fontFamily: '"Segoe Script", cursive',
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#e65100",
                    }}
                  >
                    🧾
                  </div>
                  <div style={{ fontSize: "15px", marginLeft: "4px" }}>
                    Job Title<span style={{ color: "red" }}> *</span>
                  </div>
                </div>
                <Grid
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: "#00000080",
                    borderRadius: "5px",
                    border: "0.5px solid #bdbdbd",
                    height: "40px",
                    background: "#FFFFFF",
                    textAlign: "center",
                    padding: "20px 0px 20px 0px",
                    fontFamily: "SF Pro Display",
                    fontWeight: 300,
                    fontSize: "14px",
                    lineHeight: "18.23px",
                    letterSpacing: "0%",
                    opacity: 1,
                  }}
                >
                  <TextField
                    fullWidth
                    variant="filled"
                    autoComplete="off"
                    placeholder="Job Title"
                    sx={{
                      "& .MuiInputBase-input::placeholder": {
                        fontFamily: "SF Pro Display",
                        fontWeight: 300,
                        fontSize: "14px",
                        lineHeight: "18.23px",
                        letterSpacing: "0%",
                        color: "#00000080",
                        opacity: 1,
                      },
                    }}
                    InputProps={{
                      disableUnderline: true,
                      style: {
                        color: "#00000080",

                        borderRadius: "5px",
                        //   border: '1px solid #0284C7',
                        // border: '0.5px solid #00000080',
                        height: "40px",
                        background: "#FFFFFF",
                        textAlign: "center",
                        padding: "0px 0px 15px 0px",

                        fontFamily: "SF Pro Display",
                        fontWeight: 300,
                        fontSize: "14px",
                        lineHeight: "18.23px",
                        letterSpacing: "0%",

                        opacity: 1,
                      },
                    }}
                    inputProps={{
                      style: { textAlign: "left" },
                    }}
                    required
                    name="job_title"
                    // value={ formValues.job_title.value}
                    value={
                      formValues.job_title.value || ""
                      // ||
                      // (editAijd === true ? jobTitleAi : '')
                    }
                    onChange={(e: any) => handleChange(e)}
                    // error={formValues.job_title.error}
                    // helperText={
                    //   formValues.job_title.error
                    //     ? formValues.job_title.errorMessage
                    //     : ''
                    // }
                  />
                </Grid>
              </Grid>
            )}

            {/* job role */}
            {!visibleSections.job_role && (
              <Grid id="job_role" item xs={12} sm={6} md={4} lg={3}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      fontFamily: '"Segoe Script", cursive',
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#e65100",
                    }}
                  >
                    👤
                  </div>
                  <div style={{ fontSize: "15px", marginLeft: "4px" }}>
                    Job Role<span style={{ color: "red" }}> *</span>
                  </div>
                </div>
                <Grid
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: "#00000080",
                    borderRadius: "5px",
                    border: "0.5px solid #bdbdbd",
                    height: "40px",
                    background: "#FFFFFF",
                    textAlign: "center",
                    padding: "20px 0px 20px 0px",
                    fontFamily: "SF Pro Display",
                    fontWeight: 300,
                    fontSize: "14px",
                    lineHeight: "18.23px",
                    letterSpacing: "0%",
                    opacity: 1,
                  }}
                >
                  <Autocomplete
                    freeSolo
                    options={jobCategory}
                    loading={jobCategoryLoading}
                    // value={formValues.job_role.value || (editAijd ? jobRoleAi : '')}
                    value={formValues.job_role.value || ""}
                    inputValue={jobCategoryInput}
                    onInputChange={(e, newInputValue) => {
                      setJobCategoryInput(newInputValue);
                      fetchCategories(newInputValue);
                    }}
                    onChange={(e, newValue) => {
                      const syntheticEvent = {
                        target: {
                          name: "job_role",
                          value: newValue || "",
                        },
                      } as React.ChangeEvent<HTMLInputElement>;

                      handleChange(syntheticEvent);
                    }}
                    sx={{
                      width: "100%",
                      "& .MuiOutlinedInput-root": {
                        height: "40px",
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                        padding: "5px 0px 5px 15px",
                        fontFamily: "SF Pro Display",
                        fontWeight: 300,
                        fontSize: "14px",
                        lineHeight: "18.23px",
                        letterSpacing: "0%",
                        color: "#00000080",
                        // border: '0.5px solid transparent',
                        direction: "ltr",
                      },
                      "& .MuiInputBase-input": {
                        padding: 0,
                      },
                      "& .MuiInputBase-input::placeholder": {
                        fontFamily: "SF Pro Display",
                        fontWeight: 300,
                        fontSize: "14px",
                        lineHeight: "18.23px",
                        letterSpacing: "0%",
                        color: "#00000080",
                        opacity: 1,
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Type or search role"
                        variant="outlined"
                        fullWidth
                        // error={formValues.job_role.error}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                minWidth: "30px",
                              }}
                            >
                              {jobCategoryLoading ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </Box>
                          ),
                        }}
                      />
                    )}
                  />
                  {noCategoryFound && (
                    <div
                      style={{
                        color: "#d32f2f",
                        fontSize: "13px",
                        marginTop: "5px",
                      }}
                    >
                      No category found
                    </div>
                  )}
                </Grid>
              </Grid>
            )}

            {/* job type */}
            {!visibleSections.job_type && (
              <Grid id="job_type" item xs={12} sm={6} md={4} lg={3}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      fontFamily: '"Segoe Script", cursive',
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#e65100",
                    }}
                  >
                    💼
                  </div>
                  <div style={{ fontSize: "15px", marginLeft: "4px" }}>
                    Job Type<span style={{ color: "red" }}> *</span>
                  </div>
                </div>
                <Grid
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: "#00000080",
                    borderRadius: "5px",
                    border: "0.5px solid #bdbdbd",
                    height: "40px",
                    background: "#FFFFFF",
                    textAlign: "center",
                    padding: "20px 0px 20px 0px",
                    fontFamily: "SF Pro Display",
                    fontWeight: 300,
                    fontSize: "14px",
                    lineHeight: "18.23px",
                    letterSpacing: "0%",
                    opacity: 1,
                  }}
                >
                  <FormControl sx={{ width: "100%", height: "45px" }}>
                    <Select
                      value={jobTypeName || ""}
                      // value={jobTypeName || ''}
                      displayEmpty
                      sx={{
                        height: "40px",
                        width: "100%",
                        color: jobTypeName ? "#00000080" : "#00000080", //Placeholder color
                        background: "#FFFFFF",
                        // border: '1px solid #00000080',
                        borderRadius: "5px",
                        padding: "8px 0px 5px 0px",
                        direction: "ltr",

                        fontFamily: "SF Pro Display",
                        fontWeight: 300,
                        fontSize: "14px",
                        lineHeight: "18.23px",
                        letterSpacing: "0%",
                        marginTop: "2px",
                        opacity: 1,
                        "& .MuiButtonBase-root": {
                          fontFamily: "SF Pro Display",
                          fontWeight: 300,
                          fontSize: "14px",
                          lineHeight: "18.23px",
                          letterSpacing: "0%",
                          color: "#000000",
                        },
                        "& .MuiMenuItem-root": {
                          fontFamily: "SF Pro Display",
                          fontWeight: 300,
                          fontSize: "14px",
                          lineHeight: "18.23px",
                          letterSpacing: "0%",
                          color: "#000000",
                        },
                      }}
                      onChange={handleChangeJobTypeNames}
                      input={<OutlinedInput />}
                      MenuProps={{
                        PaperProps: {
                          style: { color: "#000000", background: "#FFFFFF" },
                        },
                      }}
                    >
                      {/* Placeholder Item */}
                      <MenuItem value="" disabled>
                        <span
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",

                            fontFamily: "SF Pro Display",
                            fontWeight: 300,
                            fontSize: "14px",
                            lineHeight: "18.23px",
                            letterSpacing: "0%",
                            color: "#00000080",
                            opacity: 1,
                          }}
                        >
                          {/* {t('selectJobType')} */}
                          Select Job Type
                        </span>
                      </MenuItem>

                      {/* Actual Options */}
                      {jobTypeNames.map((name) => (
                        <MenuItem
                          key={name}
                          value={name}
                          style={getStyles(name, jobTypeName, jobTypeTheme)}
                        >
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}

            {!visibleSections.no_of_open_positions && (
              <Grid id="no_of_open_positions" item xs={12} sm={6} md={4} lg={3}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      fontFamily: '"Segoe Script", cursive',
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#e65100",
                    }}
                  >
                    📌
                  </div>
                  <div style={{ fontSize: "15px", marginLeft: "4px" }}>
                    Open Positions <span style={{ color: "red" }}> *</span>
                  </div>
                </div>
                <Grid
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: "#00000080",
                    borderRadius: "5px",
                    border: "0.5px solid #bdbdbd",
                    height: "40px",
                    background: "#FFFFFF",
                    textAlign: "center",
                    padding: "20px 0px 20px 0px",
                    fontFamily: "SF Pro Display",
                    fontWeight: 300,
                    fontSize: "14px",
                    lineHeight: "18.23px",
                    letterSpacing: "0%",
                    opacity: 1,
                  }}
                >
                  <TextField
                    fullWidth
                    variant="filled"
                    autoComplete="off"
                    placeholder="Enter No. Of Open Positions"
                    sx={{
                      "& .MuiInputBase-input::placeholder": {
                        fontFamily: "SF Pro Display",
                        fontWeight: 300,
                        fontSize: "14px",
                        lineHeight: "18.23px",
                        letterSpacing: "0%",
                        color: "#00000080",
                        opacity: 1,
                      },
                    }}
                    InputProps={{
                      disableUnderline: true,
                      style: {
                        color: "#00000080",
                        borderRadius: "5px",
                        height: "40px",
                        background: "#FFFFFF",
                        textAlign: "center",
                        padding: "0px 0px 15px 0px",
                        fontFamily: "SF Pro Display",
                        fontWeight: 300,
                        fontSize: "14px",
                        lineHeight: "18.23px",
                        letterSpacing: "0%",
                        opacity: 1,
                      },
                    }}
                    inputProps={{
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                      style: { textAlign: "left" },
                    }}
                    required
                    name="no_of_open_positions"
                    value={formValues.no_of_open_positions.value}
                    onChange={handleChange}
                    error={formValues.no_of_open_positions.error}
                  />
                </Grid>
              </Grid>
            )}
            {/* mode of work */}
            {!visibleSections.mode_of_work && (
              <Grid id="mode_of_work" item xs={12} sm={6} md={4} lg={3}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      fontFamily: '"Segoe Script", cursive',
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#e65100",
                    }}
                  >
                    🏠
                  </div>
                  <div style={{ fontSize: "15px", marginLeft: "4px" }}>
                    Mode Of Work<span style={{ color: "red" }}> *</span>
                  </div>
                </div>
                <Grid
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: "#00000080",
                    borderRadius: "5px",
                    border: "0.5px solid #bdbdbd",
                    height: "40px",
                    background: "#FFFFFF",
                    textAlign: "center",
                    padding: "20px 0px 20px 0px",
                    fontFamily: "SF Pro Display",
                    fontWeight: 300,
                    fontSize: "14px",
                    lineHeight: "18.23px",
                    letterSpacing: "0%",
                    opacity: 1,
                  }}
                >
                  <FormControl sx={{ width: "100%", height: "40px" }}>
                    <Select
                      // value={modeOfWorkName || ''} // Ensure an empty value initially
                      value={modeOfWorkName || ""}
                      displayEmpty
                      onChange={handleChangeModeOfWork}
                      input={<OutlinedInput />}
                      MenuProps={{
                        PaperProps: {
                          style: { color: "#000000", background: "#FFFFFF" },
                        },
                      }}
                      style={{
                        height: "40px",
                        width: "100%",
                        color: modeOfWorkName ? "#00000080" : "#00000080", // Darker text when selected
                        background: "#FFFFFF",
                        // border: '1px solid #00000080',
                        borderRadius: "5px",
                        padding: "5px 0px 5px 0px",
                        direction: "ltr",
                        fontFamily: "SF Pro Display",
                        fontWeight: 300,
                        fontSize: "14px",
                        lineHeight: "18.23px",
                        letterSpacing: "0%",
                        opacity: 1,
                      }}
                    >
                      {/* Placeholder Item (Disabled) */}
                      <MenuItem value="" disabled>
                        <span
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            fontFamily: "SF Pro Display",
                            fontWeight: 300,
                            fontSize: "14px",
                            lineHeight: "18.23px",
                            letterSpacing: "0%",
                            color: "#00000080",
                            opacity: 1,
                          }}
                        >
                          {/* {t('selectModeOfWork')} */}
                          Select work mode
                        </span>
                      </MenuItem>

                      {/* Actual Options */}
                      {modeOfWorkNames.map((name) => (
                        <MenuItem
                          key={name}
                          value={name}
                          style={getStyles(
                            name,
                            modeOfWorkName,
                            modeOfWorkTheme
                          )}
                        >
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}

            {/* primary skills */}
            {!visibleSections.primary_skills && (
              <Grid id="primary_skills" item xs={12} sm={6} md={4} lg={3}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      fontFamily: '"Segoe Script", cursive',
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#e65100",
                    }}
                  >
                    🛠️
                  </div>
                  <div style={{ fontSize: "15px", marginLeft: "4px" }}>
                    Primary Skills<span style={{ color: "red" }}> *</span>
                  </div>
                </div>
                <Grid
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: "#00000080",
                    borderRadius: "5px",
                    border: "0.5px solid #bdbdbd",
                    height: "40px",
                    background: "#FFFFFF",
                    textAlign: "center",
                    padding: "20px 0px 20px 0px",
                    fontFamily: "SF Pro Display",
                    fontWeight: 300,
                    fontSize: "14px",
                    lineHeight: "18.23px",
                    letterSpacing: "0%",
                    opacity: 1,
                  }}
                >
                  <TextField
                    fullWidth
                    variant="filled"
                    autoComplete="off"
                    placeholder="Enter primary skills"
                    sx={{
                      "& .MuiInputBase-input::placeholder": {
                        fontFamily: "SF Pro Display",
                        fontWeight: 300,
                        fontSize: "14px",
                        lineHeight: "18.23px",
                        letterSpacing: "0%",
                        color: "#00000080",
                        background: "#FFFFFF",
                        opacity: 1,
                      },
                    }}
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        color: "#00000080",
                        borderRadius: "5px",
                        // border: '0.5px solid #00000080',
                        height: "40px",
                        background: "#FFFFFF",
                        textAlign: "center",
                        padding: "0px 0px 15px 0px",
                        fontFamily: "SF Pro Display",
                        fontWeight: 300,
                        fontSize: "14px",
                        lineHeight: "18.23px",
                        letterSpacing: "0%",
                        opacity: 1,
                        "&:hover": {
                          color: "#00000080",
                          background: "#FFFFFF",
                        },
                      },
                    }}
                    inputProps={{
                      sx: {
                        textAlign: "left",
                      },
                    }}
                    required
                    name="primary_skills"
                    // value={primarySkillName.join(', ')} // Show skills as comma-separated values
                    // value={
                    //   primarySkillName.join(', ') || ''
                    //   // (editAijd === true ? primarySkillsAi : '')
                    // }
                    value={primarySkillName}
                    onChange={handleChangePrimarySkills}
                    error={primarySkillForm}
                  />
                </Grid>
              </Grid>
            )}
            {/* experience required */}
            {!visibleSections.experience_required && (
              <Grid id="experinece_required" item xs={12} sm={6} md={4} lg={3}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      fontFamily: '"Segoe Script", cursive',
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#e65100",
                    }}
                  >
                    🎯
                  </div>
                  <div style={{ fontSize: "15px", marginLeft: "4px" }}>
                    Experience Level<span style={{ color: "red" }}> *</span>
                  </div>
                </div>
                <Grid
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: "#00000080",
                    borderRadius: "5px",
                    border: "0.5px solid #bdbdbd",
                    height: "40px",
                    background: "#FFFFFF",
                    textAlign: "center",
                    padding: "20px 0px 20px 0px",
                    fontFamily: "SF Pro Display",
                    fontWeight: 300,
                    fontSize: "14px",
                    lineHeight: "18.23px",
                    letterSpacing: "0%",
                    opacity: 1,
                  }}
                >
                  <FormControl
                    variant="standard"
                    style={{
                      width: "100%",
                      border: "0.5px solid rgba(167, 219, 214, 0.72)",
                      borderRadius: "15px",
                      marginBottom: formValues.experience_required.error
                        ? "5px"
                        : "0px",
                    }}
                  >
                    <Select
                      disableUnderline
                      defaultValue={"-"}
                      displayEmpty
                      name="experience_required"
                      required
                      style={{
                        height: "40px",
                        width: "100%",
                        background: "#FFFFFF",
                        // border: '0.5px solid #00000080',
                        color: "#00000080",
                        borderRadius: "5px",
                        padding: "5px 0px 5px 15px",
                        direction: "ltr",
                        fontFamily: "SF Pro Display",
                        fontWeight: 300,
                        fontSize: "14px",
                        lineHeight: "18.23px",
                        letterSpacing: "0%",
                        opacity: 1,
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            color: "#000000",
                            background: "#FFFFFF",
                            maxHeight: "150px", // Limit the dropdown height
                            overflowY: "auto", // Enable scrolling if needed
                            marginTop: "5px", // Ensure it appears just below the input field
                          },
                        },
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "left",
                        },
                        transformOrigin: {
                          vertical: "top",
                          horizontal: "left",
                        },
                        // getContentAnchorEl: null, // Ensures dropdown opens right below
                      }}
                      // value={formValues.experience_required.value}
                      value={
                        formValues.experience_required.value || ""
                        // (editAijd === true ? experienceRequiredAi : '')
                      }
                      onChange={(e: any) => handleChange(e)}
                      error={formValues.experience_required.error}
                    >
                      <MenuItem value="">
                        <span
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            fontFamily: "SF Pro Display",
                            fontWeight: 300,
                            fontSize: "14px",
                            lineHeight: "18.23px",
                            letterSpacing: "0%",
                            color: "#00000080",
                            opacity: 1,
                          }}
                        >
                          Select experience
                        </span>
                      </MenuItem>
                      {experience.map((exp: any, index: number) => (
                        <MenuItem key={index} value={exp}>
                          {exp} years
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}

            {/* secondary skills */}
            {!visibleSections.secondary_skills && (
              <Grid id="secondary_skills" item xs={12} sm={6} md={4} lg={3}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      fontFamily: '"Segoe Script", cursive',
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#e65100",
                    }}
                  >
                    ⚙️
                  </div>
                  <div style={{ fontSize: "15px", marginLeft: "4px" }}>
                    Secondary Skills<span style={{ color: "red" }}> *</span>
                  </div>
                </div>
                <Grid
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: "#00000080",
                    borderRadius: "5px",
                    border: "0.5px solid #bdbdbd",
                    height: "40px",
                    background: "#FFFFFF",
                    textAlign: "center",
                    padding: "20px 0px 20px 0px",
                    fontFamily: "SF Pro Display",
                    fontWeight: 300,
                    fontSize: "14px",
                    lineHeight: "18.23px",
                    letterSpacing: "0%",
                    opacity: 1,
                  }}
                >
                  <TextField
                    fullWidth
                    variant="filled"
                    autoComplete="off"
                    placeholder="Enter Secondary Skills"
                    sx={{
                      "& .MuiInputBase-input::placeholder": {
                        fontFamily: "SF Pro Display",
                        fontWeight: 300,
                        fontSize: "14px",
                        lineHeight: "18.23px",
                        letterSpacing: "0%",
                        color: "#00000080",
                        opacity: 1,
                      },
                    }}
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        color: "#00000080",
                        borderRadius: "5px",
                        // border: '0.5px solid #00000080',
                        height: "40px",
                        background: "#FFFFFF",
                        textAlign: "center",
                        padding: "0px 0px 15px 0px",
                        fontFamily: "SF Pro Display",
                        fontWeight: 300,
                        fontSize: "14px",
                        lineHeight: "18.23px",
                        letterSpacing: "0%",
                        opacity: 1,
                      },
                    }}
                    inputProps={{
                      sx: {
                        textAlign: "left",
                      },
                    }}
                    required
                    name="secondary_skills"
                    // value={secondarySkillName.join(', ')} // Show skills as comma-separated values
                    // value={
                    //   secondarySkillName.join(', ') || ''
                    //   // (editAijd === true ? secondarySkillsAi : '')
                    // }
                    value={secondarySkillName}
                    onChange={handleChangeSecondarySkills}
                    error={secondarySkillForm}
                  />
                </Grid>
              </Grid>
            )}

            {/* domain skills */}
            {!visibleSections.domain_skills && (
              <Grid id="skills" item xs={12} sm={6} md={4} lg={3}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      fontFamily: '"Segoe Script", cursive',
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#e65100",
                    }}
                  >
                    🧠
                  </div>
                  <div style={{ fontSize: "15px", marginLeft: "4px" }}>
                    Specific Domain Skills
                    <span style={{ color: "red" }}> *</span>
                  </div>
                </div>
                <Grid
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: "#00000080",
                    borderRadius: "5px",
                    border: "0.5px solid #bdbdbd",
                    height: "40px",
                    background: "#FFFFFF",
                    textAlign: "center",
                    padding: "20px 0px 20px 0px",
                    fontFamily: "SF Pro Display",
                    fontWeight: 300,
                    fontSize: "14px",
                    lineHeight: "18.23px",
                    letterSpacing: "0%",
                    opacity: 1,
                  }}
                >
                  <TextField
                    fullWidth
                    variant="filled"
                    autoComplete="off"
                    placeholder="Enter Specific domain skills"
                    sx={{
                      "& .MuiInputBase-input::placeholder": {
                        fontFamily: "SF Pro Display",
                        fontWeight: 300,
                        fontSize: "14px",
                        lineHeight: "18.23px",
                        letterSpacing: "0%",
                        color: "#00000080",
                        opacity: 1,
                      },
                    }}
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        color: "#00000080",
                        borderRadius: "5px",
                        // border: '0.5px solid #00000080',
                        height: "40px",
                        background: "#FFFFFF",
                        textAlign: "center",
                        padding: "0px 0px 15px 0px",
                        fontFamily: "SF Pro Display",
                        fontWeight: 300,
                        fontSize: "14px",
                        lineHeight: "18.23px",
                        letterSpacing: "0%",
                        opacity: 1,
                      },
                    }}
                    inputProps={{
                      sx: {
                        textAlign: "left",
                      },
                    }}
                    required
                    name="specific_domain_skills"
                    // value={secondarySkillName.join(', ')} // Show skills as comma-separated values
                    // value={
                    //    specificDomainSkill.join(', ') || ''
                    //   // (editAijd === true ? secondarySkillsAi : '')
                    // }
                    value={specificDomainSkill}
                    onChange={handleChangeSpecificDomainSkills}
                    error={specificDomainSkillForm}
                  />
                </Grid>
              </Grid>
            )}

            {/* Job location */}
            {!visibleSections.location && (
              <>
                <Grid id="location" item>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        fontFamily: '"Segoe Script", cursive',
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#e65100",
                      }}
                    >
                      📍
                    </div>
                    <div style={{ fontSize: "15px", marginLeft: "4px" }}>
                      Location<span style={{ color: "red" }}> *</span>
                    </div>
                  </div>
                  <Grid
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      color: "#00000080",
                      borderRadius: "5px",
                      // border: '0.5px solid #bdbdbd',
                      height: "40px",
                      background: "#FFFFFF",
                      textAlign: "center",
                      padding: "20px 0px 20px 0px",
                      fontFamily: "SF Pro Display",
                      fontWeight: 300,
                      fontSize: "14px",
                      lineHeight: "18.23px",
                      letterSpacing: "0%",
                      opacity: 1,
                    }}
                  >
                    <Grid
                      container
                      // spacing={2}
                      // justifyContent="space-between"
                      spacing={1}
                      direction="row"
                      // sx={{ padding: '0 36px' }}
                    >
                      <Grid id="mainCountry" item xs={4}>
                        <Autocomplete
                          sx={{
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                              // height: '40px',
                              width: "100%",

                              // fontSize: '12px',

                              background: "#FFFFFF",
                              // border: '0.5px solid #00000080',
                              color: "#00000080",
                              borderRadius: "5px",
                              padding: "0px 0px 0px 15px",

                              fontFamily: "SF Pro Display",
                              fontWeight: 300,
                              fontSize: "14px",
                              lineHeight: "18.23px",
                              letterSpacing: "0%",

                              opacity: 1,

                              height: "44px",
                              // // borderRadius: '12px',
                              border: "1px solid #bdbdbd",
                              "& fieldset": { borderColor: "transparent" },
                              "&:hover fieldset": {
                                borderColor: "transparent",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "transparent",
                              },
                            },
                          }}
                          // value={selectedCountry || null}
                          value={
                            selectedCountry || null
                            // selectedCountry || (editAijd === true ? countryAi : null)
                          }
                          options={countries}
                          getOptionLabel={(option) => option.name}
                          onChange={(event, newValue) => {
                            if (newValue) {
                              setCountryIso2(newValue.iso2);
                              setSelectedCountry(newValue);
                              setSelectedCountryValue(newValue.name);
                              setCountryError(false);

                              // Reset state and city when country changes
                              setStateIso2("");
                              setSelectedState("");
                              setSelectedStateValue("");
                              // setStateError(false)

                              setSelectedCity("");
                              setSelectedCityValue("");
                              // setCityError(false)
                            } else {
                              setCountryIso2("");
                              setSelectedCountry("");
                              setCountryError(true);

                              // Reset state and city when no country is selected
                              setStateIso2("");
                              setSelectedState("");
                              setSelectedStateValue("");
                              // setStateError(false)

                              setSelectedCity("");
                              setSelectedCityValue("");
                              // setCityError(false)
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Country"
                              sx={{
                                "& .MuiInputBase-input::placeholder": {
                                  fontFamily: "SF Pro Display",
                                  fontWeight: 300,
                                  fontSize: "14px",
                                  lineHeight: "18.23px",
                                  letterSpacing: "0%",
                                  color: "#00000080",
                                  opacity: 1,
                                },
                              }}
                              helperText={countryError}
                              // helperText={countryError ? "Please select a country" : ""}
                            />
                          )}
                        />
                        {countryError ? (
                          <p
                            style={{
                              color: "red",
                              margin: "0px",
                              padding: "0px",
                            }}
                          >
                            select country
                          </p>
                        ) : (
                          ""
                        )}
                      </Grid>

                      <Grid id="mainState" item xs={4}>
                        <Autocomplete
                          sx={{
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                              // height: '40px',
                              width: "100%",

                              // fontSize: '12px',

                              background: "#FFFFFF",
                              border: "0.5px solid #bdbdbd",
                              color: "#00000080",
                              borderRadius: "5px",
                              padding: "5px 0px 5px 15px",

                              fontFamily: "SF Pro Display",
                              fontWeight: 300,
                              fontSize: "14px",
                              lineHeight: "18.23px",
                              letterSpacing: "0%",

                              opacity: 1,
                              height: "44px",
                              // borderRadius: '12px',
                              // border: '1px solid #00000080',
                              "& fieldset": { borderColor: "transparent" },
                              "&:hover fieldset": {
                                borderColor: "transparent",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "transparent",
                              },
                            },
                          }}
                          options={states}
                          // value={selectedState || null} // Ensure the selected value updates
                          value={selectedState || null}
                          getOptionLabel={(option) => option.name}
                          onChange={(event, newValue) => {
                            if (newValue && selectedCountry) {
                              setStateIso2(newValue.iso2);
                              setSelectedState(newValue);
                              setSelectedStateValue(newValue.name);
                              setStateError(false);

                              setSelectedCity("");
                              setSelectedCityValue("");
                              setCityError(false);
                              setLocationError(false);
                            } else {
                              setStateIso2("");
                              setSelectedState("");
                              setStateError(true);

                              setSelectedCity("");
                              setSelectedCityValue("");
                              setCityError(false);
                              setLocationError(false);
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="State"
                              sx={{
                                "& .MuiInputBase-input::placeholder": {
                                  fontFamily: "SF Pro Display",
                                  fontWeight: 300,
                                  fontSize: "14px",
                                  lineHeight: "18.23px",
                                  letterSpacing: "0%",
                                  color: "#00000080",
                                  opacity: 1,
                                },
                              }}
                              helperText={stateError}
                            />
                          )}
                          disabled={!selectedCountry} // Disable until a country is selected
                        />
                        {stateError ? (
                          <p
                            style={{
                              color: "red",
                              margin: "0px",
                              padding: "0px",
                            }}
                          >
                            selet state
                          </p>
                        ) : (
                          ""
                        )}
                      </Grid>

                      <Grid id="mainCity" item xs={3.9}>
                        <Autocomplete
                          sx={{
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                              // height: '40px',
                              width: "100%",

                              // fontSize: '12px',

                              background: "#FFFFFF",
                              border: "0.5px solid #bdbdbd",
                              color: "#00000080",
                              borderRadius: "5px",
                              padding: "0px 0px 0px 15px",

                              fontFamily: "SF Pro Display",
                              fontWeight: 300,
                              fontSize: "14px",
                              lineHeight: "18.23px",
                              letterSpacing: "0%",

                              opacity: 1,

                              height: "44px",
                              // // borderRadius: '12px',
                              // border: '1px solid #00000080',
                              "& fieldset": { borderColor: "transparent" },
                              "&:hover fieldset": {
                                borderColor: "transparent",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "transparent",
                              },
                            },
                          }}
                          // value={selectedCity || null} // Ensure the selected value updates
                          value={
                            selectedCity || null
                            // selectedCity || (editAijd === true ? cityAi : null)
                          }
                          options={cities}
                          getOptionLabel={(option) => option.name}
                          onChange={(event, newValue) => {
                            console.log("Selected City:", newValue);
                            if (newValue) {
                              setSelectedCity(newValue);
                              setSelectedCityValue(newValue.name);
                              setCityError(false);
                            } else {
                              setSelectedCity("");
                              setCityError(true);
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="City"
                              sx={{
                                "& .MuiInputBase-input::placeholder": {
                                  fontFamily: "SF Pro Display",
                                  fontWeight: 300,
                                  fontSize: "14px",
                                  lineHeight: "18.23px",
                                  letterSpacing: "0%",
                                  color: "#00000080",
                                  opacity: 1,
                                },
                              }}
                              helperText={cityError}
                            />
                          )}
                          disabled={!selectedState} // Disable until a state is selected
                        />
                        {cityError ? (
                          <p
                            style={{
                              color: "red",
                              margin: "0px",
                              padding: "0px",
                            }}
                          >
                            select city
                          </p>
                        ) : (
                          ""
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
        </div>

        {/* Bottom Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", gap: "15px" }}>
            <React.Fragment>
              <Dialog
                open={openPreview}
                // onClose={handleClosePreview}
                onClose={(event, reason) => {
                  if (
                    reason !== "backdropClick" &&
                    reason !== "escapeKeyDown"
                  ) {
                    handleClosePreview();
                  }
                }}
                scroll={scrollPreview}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
              >
                <DialogTitle>
                  <Grid
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Grid
                      id="scroll-dialog-title"
                      sx={{
                        color: "rgba(2, 132, 199, 1)",
                        fontFamily: "SF Pro Display",
                        fontWeight: 700,
                        fontSize: "16px",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                      }}
                    >
                      Review & Customize Your AI-Generated Job Description
                    </Grid>
                    <Grid>
                      <Button onClick={handleClosePreview}>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <CancelPresentationIcon
                          sx={{
                            color: "red",
                            "&:hover": {
                              backgroundColor: "red",
                              color: "#fff",
                            },
                          }}
                        />
                      </Button>
                    </Grid>
                  </Grid>
                </DialogTitle>
                <DialogContent dividers={scrollPreview === "paper"}>
                  <DialogContentText
                    id="scroll-dialog-description"
                    ref={descriptionElementRef}
                    tabIndex={-1}
                  >
                    <Grid id="job_title" item xs={12} sm={6} md={4} lg={3}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            fontFamily: '"Segoe Script", cursive',
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#e65100",
                          }}
                        >
                          🧾
                        </div>
                        <div style={{ fontSize: "15px", marginLeft: "4px" }}>
                          Job Title
                        </div>
                      </div>
                      <Grid
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          color: "#00000080",
                          borderRadius: "5px",
                          border: "0.5px solid #bdbdbd",
                          height: "40px",
                          background: "#FFFFFF",
                          textAlign: "center",
                          padding: "20px 0px 20px 0px",
                          fontFamily: "SF Pro Display",
                          fontWeight: 300,
                          fontSize: "14px",
                          lineHeight: "18.23px",
                          letterSpacing: "0%",
                          opacity: 1,
                        }}
                      >
                        <TextField
                          fullWidth
                          variant="filled"
                          autoComplete="off"
                          placeholder="Job Title"
                          sx={{
                            "& .MuiInputBase-input::placeholder": {
                              fontFamily: "SF Pro Display",
                              fontWeight: 300,
                              fontSize: "14px",
                              lineHeight: "18.23px",
                              letterSpacing: "0%",
                              color: "#00000080",
                              opacity: 1,
                            },
                          }}
                          InputProps={{
                            disableUnderline: true,
                            style: {
                              color: "#00000080",

                              borderRadius: "5px",
                              //   border: '1px solid #0284C7',
                              // border: '0.5px solid #00000080',
                              height: "40px",
                              background: "#FFFFFF",
                              textAlign: "center",
                              padding: "0px 0px 15px 0px",

                              fontFamily: "SF Pro Display",
                              fontWeight: 300,
                              fontSize: "14px",
                              lineHeight: "18.23px",
                              letterSpacing: "0%",

                              opacity: 1,
                            },
                          }}
                          inputProps={{
                            style: { textAlign: "left" },
                          }}
                          required
                          name="job_title"
                          // value={ formValues.job_title.value}
                          value={
                            jobTitleAi || ""
                            // ||
                            // (editAijd === true ? jobTitleAi : '')
                          }
                          onChange={handleChangeAi}
                          error={!!formErrorsAi.job_title}
                          helperText={formErrorsAi.job_title}
                        />
                      </Grid>
                    </Grid>

                    <Grid id="job_role" item xs={12} sm={6} md={4} lg={3}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            fontFamily: '"Segoe Script", cursive',
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#e65100",
                          }}
                        >
                          👤
                        </div>
                        <div style={{ fontSize: "15px", marginLeft: "4px" }}>
                          Job Role
                        </div>
                      </div>
                      <Grid
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          color: "#00000080",
                          borderRadius: "5px",
                          border: "0.5px solid #bdbdbd",
                          height: "40px",
                          background: "#FFFFFF",
                          textAlign: "center",
                          padding: "20px 0px 20px 0px",
                          fontFamily: "SF Pro Display",
                          fontWeight: 300,
                          fontSize: "14px",
                          lineHeight: "18.23px",
                          letterSpacing: "0%",
                          opacity: 1,
                        }}
                      >
                        <Autocomplete
                          freeSolo
                          options={jobCategory}
                          loading={jobCategoryLoading}
                          // value={formValues.job_role.value || (editAijd ? jobRoleAi : '')}
                          value={formValues.job_role.value || ""}
                          inputValue={jobCategoryInput}
                          onInputChange={(e, newInputValue) => {
                            setJobCategoryInput(newInputValue);
                            fetchCategories(newInputValue);
                          }}
                          onChange={(e, newValue) => {
                            const syntheticEvent = {
                              target: {
                                name: "job_role",
                                value: newValue || "",
                              },
                            } as React.ChangeEvent<HTMLInputElement>;

                            handleChange(syntheticEvent);
                          }}
                          sx={{
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                              height: "40px",
                              backgroundColor: "#FFFFFF",
                              borderRadius: "5px",
                              padding: "5px 0px 5px 15px",
                              fontFamily: "SF Pro Display",
                              fontWeight: 300,
                              fontSize: "14px",
                              lineHeight: "18.23px",
                              letterSpacing: "0%",
                              color: "#00000080",
                              // border: '0.5px solid transparent',
                              direction: "ltr",
                            },
                            "& .MuiInputBase-input": {
                              padding: 0,
                            },
                            "& .MuiInputBase-input::placeholder": {
                              fontFamily: "SF Pro Display",
                              fontWeight: 300,
                              fontSize: "14px",
                              lineHeight: "18.23px",
                              letterSpacing: "0%",
                              color: "#00000080",
                              opacity: 1,
                            },
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Type or search role"
                              variant="outlined"
                              fullWidth
                              error={formValues.job_role.error}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      minWidth: "30px",
                                    }}
                                  >
                                    {jobCategoryLoading ? (
                                      <CircularProgress
                                        color="inherit"
                                        size={20}
                                      />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                  </Box>
                                ),
                              }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>

                    <Grid id="job_type" item xs={12} sm={6} md={4} lg={3}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            fontFamily: '"Segoe Script", cursive',
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#e65100",
                          }}
                        >
                          💼
                        </div>
                        <div style={{ fontSize: "15px", marginLeft: "4px" }}>
                          Job Type
                        </div>
                      </div>
                      <Grid
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          color: "#00000080",
                          borderRadius: "5px",
                          border: "0.5px solid #bdbdbd",
                          height: "40px",
                          background: "#FFFFFF",
                          textAlign: "center",
                          padding: "17px 0px 17px 0px",
                          fontFamily: "SF Pro Display",
                          fontWeight: 300,
                          fontSize: "14px",
                          lineHeight: "18.23px",
                          letterSpacing: "0%",
                          opacity: 1,
                        }}
                      >
                        <FormControl
                          sx={{
                            width: "100%",
                            height: "45px",
                            paddingTop: "5px",
                          }}
                        >
                          <Select
                            // value={jobTypeName || ''}
                            displayEmpty
                            sx={{
                              height: "40px",
                              width: "100%",
                              color: jobTypeAi ? "#00000080" : "#00000080", //Placeholder color
                              background: "#FFFFFF",
                              // border: '1px solid #00000080',
                              borderRadius: "5px",
                              padding: "5px 0px 5px 0px",
                              direction: "ltr",

                              fontFamily: "SF Pro Display",
                              fontWeight: 300,
                              fontSize: "14px",
                              lineHeight: "18.23px",
                              letterSpacing: "0%",

                              opacity: 1,
                              "& .MuiButtonBase-root": {
                                fontFamily: "SF Pro Display",
                                fontWeight: 300,
                                fontSize: "14px",
                                lineHeight: "18.23px",
                                letterSpacing: "0%",
                                color: "#000000",
                              },
                              "& .MuiMenuItem-root": {
                                fontFamily: "SF Pro Display",
                                fontWeight: 300,
                                fontSize: "14px",
                                lineHeight: "18.23px",
                                letterSpacing: "0%",
                                color: "#000000",
                              },
                            }}
                            value={jobTypeAi}
                            onChange={handleChangeJobTypeAi}
                            input={<OutlinedInput />}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  color: "#000000",
                                  background: "#FFFFFF",
                                },
                              },
                            }}
                          >
                            {/* Placeholder Item */}
                            <MenuItem value="" disabled>
                              <span
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-between",

                                  fontFamily: "SF Pro Display",
                                  fontWeight: 300,
                                  fontSize: "14px",
                                  lineHeight: "18.23px",
                                  letterSpacing: "0%",
                                  color: "#00000080",
                                  opacity: 1,
                                }}
                              >
                                {/* {t('selectJobType')} */}
                                Select Job Type
                              </span>
                            </MenuItem>

                            {/* Actual Options */}
                            {jobTypeNames.map((name) => (
                              <MenuItem
                                key={name}
                                value={name}
                                style={getStyles(
                                  name,
                                  jobTypeName,
                                  jobTypeTheme
                                )}
                              >
                                {name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Grid
                      id="no_of_open_positions"
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            fontFamily: '"Segoe Script", cursive',
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#e65100",
                          }}
                        >
                          📌
                        </div>
                        <div style={{ fontSize: "15px", marginLeft: "4px" }}>
                          Open Positions{" "}
                          <span style={{ color: "red" }}> *</span>
                        </div>
                      </div>
                      <Grid
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          color: "#00000080",
                          borderRadius: "5px",
                          border: "0.5px solid #bdbdbd",
                          height: "40px",
                          background: "#FFFFFF",
                          textAlign: "center",
                          padding: "20px 0px 20px 0px",
                          fontFamily: "SF Pro Display",
                          fontWeight: 300,
                          fontSize: "14px",
                          lineHeight: "18.23px",
                          letterSpacing: "0%",
                          opacity: 1,
                        }}
                      >
                        <TextField
                          fullWidth
                          variant="filled"
                          autoComplete="off"
                          placeholder="Enter No. Of Open Positions"
                          sx={{
                            "& .MuiInputBase-input::placeholder": {
                              fontFamily: "SF Pro Display",
                              fontWeight: 300,
                              fontSize: "14px",
                              lineHeight: "18.23px",
                              letterSpacing: "0%",
                              color: "#00000080",
                              opacity: 1,
                            },
                          }}
                          InputProps={{
                            disableUnderline: true,
                            style: {
                              color: "#00000080",
                              borderRadius: "5px",
                              height: "40px",
                              background: "#FFFFFF",
                              textAlign: "center",
                              padding: "0px 0px 15px 0px",
                              fontFamily: "SF Pro Display",
                              fontWeight: 300,
                              fontSize: "14px",
                              lineHeight: "18.23px",
                              letterSpacing: "0%",
                              opacity: 1,
                            },
                          }}
                          inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                            style: { textAlign: "left" },
                          }}
                          required
                          name="no_of_open_positions"
                          value={formValues.no_of_open_positions.value}
                          onChange={handleChange}
                          error={formValues.no_of_open_positions.error}
                          // helperText={
                          //   formValues.no_of_open_positions.error
                          //     ? formValues.no_of_open_positions.errorMessage
                          //     : ''
                          // }
                        />

                        {/* <Grid sx={{padding: '15px 0px 15px 0px',}}>
            <Button sx={{padding:'10px'}}>
              <DeleteOutlineIcon sx={{color:'red', '&:hover':{color:'red', cursor:'pointer'}}}/>
            </Button>
            </Grid> */}
                      </Grid>
                    </Grid>
                    <Grid id="mode_of_work" item xs={12} sm={6} md={4} lg={3}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            fontFamily: '"Segoe Script", cursive',
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#e65100",
                          }}
                        >
                          🏠
                        </div>
                        <div style={{ fontSize: "15px", marginLeft: "4px" }}>
                          Mode Of Work
                        </div>
                      </div>
                      <Grid
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          color: "#00000080",
                          borderRadius: "5px",
                          border: "0.5px solid #bdbdbd",
                          height: "40px",
                          background: "#FFFFFF",
                          textAlign: "center",
                          padding: "20px 0px 20px 0px",
                          fontFamily: "SF Pro Display",
                          fontWeight: 300,
                          fontSize: "14px",
                          lineHeight: "18.23px",
                          letterSpacing: "0%",
                          opacity: 1,
                        }}
                      >
                        <FormControl sx={{ width: "100%", height: "40px" }}>
                          <Select
                            // value={modeOfWorkName || ''} // Ensure an empty value initially

                            displayEmpty
                            value={modeOfWorkAi}
                            onChange={handleChangeModeOfWorkAi}
                            input={<OutlinedInput />}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  color: "#000000",
                                  background: "#FFFFFF",
                                },
                              },
                            }}
                            style={{
                              height: "40px",
                              width: "100%",
                              color: modeOfWorkAi ? "#00000080" : "#00000080", // Darker text when selected
                              background: "#FFFFFF",
                              // border: '1px solid #00000080',
                              borderRadius: "5px",
                              padding: "5px 0px 5px 0px",
                              direction: "ltr",
                              fontFamily: "SF Pro Display",
                              fontWeight: 300,
                              fontSize: "14px",
                              lineHeight: "18.23px",
                              letterSpacing: "0%",
                              opacity: 1,
                            }}
                          >
                            {/* Placeholder Item (Disabled) */}
                            <MenuItem value="" disabled>
                              <span
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  fontFamily: "SF Pro Display",
                                  fontWeight: 300,
                                  fontSize: "14px",
                                  lineHeight: "18.23px",
                                  letterSpacing: "0%",
                                  color: "#00000080",
                                  opacity: 1,
                                }}
                              >
                                {/* {t('selectModeOfWork')} */}
                                Select work mode
                              </span>
                            </MenuItem>

                            {/* Actual Options */}
                            {modeOfWorkNames.map((name) => (
                              <MenuItem
                                key={name}
                                value={name}
                                style={getStyles(
                                  name,
                                  modeOfWorkName,
                                  modeOfWorkTheme
                                )}
                              >
                                {name}
                              </MenuItem>
                            ))}
                          </Select>

                          {/* {modeOfWorkForm && (
                    <FormHelperText
                      sx={{ color: '#b71c1c', padding: '5px 0px' }}
                    >
                      Select work mode
                    </FormHelperText>
                  )} */}
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Grid id="primary_skills" item xs={12} sm={6} md={4} lg={3}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            fontFamily: '"Segoe Script", cursive',
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#e65100",
                          }}
                        >
                          🛠️
                        </div>
                        <div style={{ fontSize: "15px", marginLeft: "4px" }}>
                          Primary Skills
                        </div>
                      </div>
                      <Grid
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          color: "#00000080",
                          borderRadius: "5px",
                          border: "0.5px solid #bdbdbd",
                          height: "40px",
                          background: "#FFFFFF",
                          textAlign: "center",
                          padding: "20px 0px 20px 0px",
                          fontFamily: "SF Pro Display",
                          fontWeight: 300,
                          fontSize: "14px",
                          lineHeight: "18.23px",
                          letterSpacing: "0%",
                          opacity: 1,
                        }}
                      >
                        <TextField
                          fullWidth
                          variant="filled"
                          autoComplete="off"
                          placeholder="Enter primary skills"
                          sx={{
                            "& .MuiInputBase-input::placeholder": {
                              fontFamily: "SF Pro Display",
                              fontWeight: 300,
                              fontSize: "14px",
                              lineHeight: "18.23px",
                              letterSpacing: "0%",
                              color: "#00000080",
                              background: "#FFFFFF",
                              opacity: 1,
                            },
                          }}
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              color: "#00000080",
                              borderRadius: "5px",
                              // border: '0.5px solid #00000080',
                              height: "40px",
                              background: "#FFFFFF",
                              textAlign: "center",
                              padding: "0px 0px 15px 0px",
                              fontFamily: "SF Pro Display",
                              fontWeight: 300,
                              fontSize: "14px",
                              lineHeight: "18.23px",
                              letterSpacing: "0%",
                              opacity: 1,
                              "&:hover": {
                                color: "#00000080",
                                background: "#FFFFFF",
                              },
                            },
                          }}
                          inputProps={{
                            sx: {
                              textAlign: "left",
                            },
                          }}
                          required
                          name="primary_skills"
                          // value={primarySkillName.join(', ')} // Show skills as comma-separated values
                          value={primarySkillsAi}
                          onChange={handleChangePrimarySkillsAi}
                          // helperText={
                          //   primarySkillForm ? 'enter atleast oen skill' : ''
                          // }
                        />
                      </Grid>
                    </Grid>

                    <Grid
                      id="experinece_required"
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            fontFamily: '"Segoe Script", cursive',
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#e65100",
                          }}
                        >
                          🎯
                        </div>
                        <div style={{ fontSize: "15px", marginLeft: "4px" }}>
                          Experience Level
                        </div>
                      </div>
                      <Grid
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          color: "#00000080",
                          borderRadius: "5px",
                          border: "0.5px solid #bdbdbd",
                          height: "40px",
                          background: "#FFFFFF",
                          textAlign: "center",
                          padding: "20px 0px 20px 0px",
                          fontFamily: "SF Pro Display",
                          fontWeight: 300,
                          fontSize: "14px",
                          lineHeight: "18.23px",
                          letterSpacing: "0%",
                          opacity: 1,
                        }}
                      >
                        <FormControl
                          variant="standard"
                          style={{
                            width: "100%",
                            border: "0.5px solid rgba(167, 219, 214, 0.72)",
                            borderRadius: "15px",
                            marginBottom: formValues.experience_required.error
                              ? "5px"
                              : "0px",
                          }}
                        >
                          <Select
                            disableUnderline
                            defaultValue={"-"}
                            displayEmpty
                            name="experience_required"
                            required
                            style={{
                              height: "40px",
                              width: "100%",
                              background: "#FFFFFF",
                              // border: '0.5px solid #00000080',
                              color: "#00000080",
                              borderRadius: "5px",
                              padding: "5px 0px 5px 15px",
                              direction: "ltr",
                              fontFamily: "SF Pro Display",
                              fontWeight: 300,
                              fontSize: "14px",
                              lineHeight: "18.23px",
                              letterSpacing: "0%",
                              opacity: 1,
                            }}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  color: "#000000",
                                  background: "#FFFFFF",
                                  maxHeight: "150px", // Limit the dropdown height
                                  overflowY: "auto", // Enable scrolling if needed
                                  marginTop: "5px", // Ensure it appears just below the input field
                                },
                              },
                              anchorOrigin: {
                                vertical: "bottom",
                                horizontal: "left",
                              },
                              transformOrigin: {
                                vertical: "top",
                                horizontal: "left",
                              },
                              // getContentAnchorEl: null, // Ensures dropdown opens right below
                            }}
                            // value={formValues.experience_required.value}
                            value={experienceRequiredAi}
                            onChange={handleChangeExperienceAi}
                          >
                            <MenuItem value="">
                              <span
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  fontFamily: "SF Pro Display",
                                  fontWeight: 300,
                                  fontSize: "14px",
                                  lineHeight: "18.23px",
                                  letterSpacing: "0%",
                                  color: "#00000080",
                                  opacity: 1,
                                }}
                              >
                                Select experience
                              </span>
                            </MenuItem>
                            {experience.map((exp: any, index: number) => (
                              <MenuItem key={index} value={exp}>
                                {exp} years
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {/* <div style={{ paddingTop: '5px' }}> */}
                        {/* {formValues.experience_required.error && (
                <span
                  style={{
                    color: '#B32800',
                    fontSize: '12px',
                    paddingLeft: '10px',
                    marginTop: '8px',
                  }}
                >
                  {formValues.experience_required.errorMessage}
                </span>
              )} */}
                      </Grid>
                    </Grid>

                    <Grid
                      id="secondary_skills"
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            fontFamily: '"Segoe Script", cursive',
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#e65100",
                          }}
                        >
                          ⚙️
                        </div>
                        <div style={{ fontSize: "15px", marginLeft: "4px" }}>
                          Secondary Skills
                        </div>
                      </div>
                      <Grid
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          color: "#00000080",
                          borderRadius: "5px",
                          border: "0.5px solid #bdbdbd",
                          height: "40px",
                          background: "#FFFFFF",
                          textAlign: "center",
                          padding: "20px 0px 20px 0px",
                          fontFamily: "SF Pro Display",
                          fontWeight: 300,
                          fontSize: "14px",
                          lineHeight: "18.23px",
                          letterSpacing: "0%",
                          opacity: 1,
                        }}
                      >
                        <TextField
                          fullWidth
                          variant="filled"
                          autoComplete="off"
                          placeholder="Enter Secondary Skills"
                          sx={{
                            "& .MuiInputBase-input::placeholder": {
                              fontFamily: "SF Pro Display",
                              fontWeight: 300,
                              fontSize: "14px",
                              lineHeight: "18.23px",
                              letterSpacing: "0%",
                              color: "#00000080",
                              opacity: 1,
                            },
                          }}
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              color: "#00000080",
                              borderRadius: "5px",
                              // border: '0.5px solid #00000080',
                              height: "40px",
                              background: "#FFFFFF",
                              textAlign: "center",
                              padding: "0px 0px 15px 0px",
                              fontFamily: "SF Pro Display",
                              fontWeight: 300,
                              fontSize: "14px",
                              lineHeight: "18.23px",
                              letterSpacing: "0%",
                              opacity: 1,
                            },
                          }}
                          inputProps={{
                            sx: {
                              textAlign: "left",
                            },
                          }}
                          required
                          name="secondary_skills"
                          // value={secondarySkillName.join(', ')} // Show skills as comma-separated values
                          value={secondarySkillsAi}
                          onChange={handleChangeSecondarySkillsAi}
                          // helperText={
                          //   secondarySkillForm ? 'Enter atleast one skill' : ''
                          // }
                        />
                      </Grid>
                    </Grid>

                    <Grid id="skills" item xs={12} sm={6} md={4} lg={3}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            fontFamily: '"Segoe Script", cursive',
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#e65100",
                          }}
                        >
                          🧠
                        </div>
                        <div style={{ fontSize: "15px", marginLeft: "4px" }}>
                          Specific Domain Skills
                        </div>
                      </div>
                      <Grid
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          color: "#00000080",
                          borderRadius: "5px",
                          border: "0.5px solid #bdbdbd",
                          height: "40px",
                          background: "#FFFFFF",
                          textAlign: "center",
                          padding: "20px 0px 20px 0px",
                          fontFamily: "SF Pro Display",
                          fontWeight: 300,
                          fontSize: "14px",
                          lineHeight: "18.23px",
                          letterSpacing: "0%",
                          opacity: 1,
                        }}
                      >
                        <TextField
                          fullWidth
                          variant="filled"
                          autoComplete="off"
                          placeholder="Enter Specific domain skills"
                          sx={{
                            "& .MuiInputBase-input::placeholder": {
                              fontFamily: "SF Pro Display",
                              fontWeight: 300,
                              fontSize: "14px",
                              lineHeight: "18.23px",
                              letterSpacing: "0%",
                              color: "#00000080",
                              opacity: 1,
                            },
                          }}
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              color: "#00000080",
                              borderRadius: "5px",
                              // border: '0.5px solid #00000080',
                              height: "40px",
                              background: "#FFFFFF",
                              textAlign: "center",
                              padding: "0px 0px 15px 0px",
                              fontFamily: "SF Pro Display",
                              fontWeight: 300,
                              fontSize: "14px",
                              lineHeight: "18.23px",
                              letterSpacing: "0%",
                              opacity: 1,
                            },
                          }}
                          inputProps={{
                            sx: {
                              textAlign: "left",
                            },
                          }}
                          required
                          name="specific_domain_skills"
                          // value={secondarySkillName.join(', ')} // Show skills as comma-separated values
                          value={specificDomainSkillsAi}
                          onChange={handleChangeSpecificDomainSkillsAi}
                          // helperText={
                          //   secondarySkillForm ? 'Enter atleast one skill' : ''
                          // }
                        />
                      </Grid>
                    </Grid>

                    <Grid id="location" item>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            fontFamily: '"Segoe Script", cursive',
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#e65100",
                          }}
                        >
                          📍
                        </div>
                        <div style={{ fontSize: "15px", marginLeft: "4px" }}>
                          Location
                        </div>
                      </div>
                      <Grid
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          color: "#00000080",
                          borderRadius: "5px",
                          // border: '0.5px solid #bdbdbd',
                          height: "40px",
                          background: "#FFFFFF",
                          textAlign: "center",
                          padding: "20px 0px 20px 0px",
                          fontFamily: "SF Pro Display",
                          fontWeight: 300,
                          fontSize: "14px",
                          lineHeight: "18.23px",
                          letterSpacing: "0%",
                          opacity: 1,
                        }}
                      >
                        <Grid
                          container
                          // spacing={2}
                          // justifyContent="space-between"
                          spacing={1}
                          direction="row"
                          // sx={{ padding: '0 36px' }}
                        >
                          <Grid id="mainCountry" item xs={4}>
                            <Autocomplete
                              sx={{
                                width: "100%",
                                "& .MuiOutlinedInput-root": {
                                  // height: '40px',
                                  width: "100%",

                                  // fontSize: '12px',

                                  background: "#FFFFFF",
                                  // border: '0.5px solid #00000080',
                                  color: "#00000080",
                                  borderRadius: "5px",
                                  padding: "0px 0px 0px 15px",

                                  fontFamily: "SF Pro Display",
                                  fontWeight: 300,
                                  fontSize: "14px",
                                  lineHeight: "18.23px",
                                  letterSpacing: "0%",

                                  opacity: 1,

                                  height: "44px",
                                  // // borderRadius: '12px',
                                  border: "1px solid #bdbdbd",
                                  "& fieldset": { borderColor: "transparent" },
                                  "&:hover fieldset": {
                                    borderColor: "transparent",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "transparent",
                                  },
                                },
                              }}
                              // value={selectedCountry || null}
                              value={
                                selectedCountry || null
                                // selectedCountry || (editAijd === true ? countryAi : null)
                              }
                              options={countries}
                              getOptionLabel={(option) => option.name}
                              onChange={(event, newValue) => {
                                if (newValue) {
                                  setCountryIso2(newValue.iso2);
                                  setSelectedCountry(newValue);
                                  setSelectedCountryValue(newValue.name);
                                  setCountryError(false);

                                  // Reset state and city when country changes
                                  setStateIso2("");
                                  setSelectedState("");
                                  setSelectedStateValue("");
                                  // setStateError(false)

                                  setSelectedCity("");
                                  setSelectedCityValue("");
                                  // setCityError(false)
                                } else {
                                  setCountryIso2("");
                                  setSelectedCountry("");
                                  setCountryError(true);

                                  // Reset state and city when no country is selected
                                  setStateIso2("");
                                  setSelectedState("");
                                  setSelectedStateValue("");
                                  // setStateError(false)

                                  setSelectedCity("");
                                  setSelectedCityValue("");
                                  // setCityError(false)
                                }
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Country"
                                  sx={{
                                    "& .MuiInputBase-input::placeholder": {
                                      fontFamily: "SF Pro Display",
                                      fontWeight: 300,
                                      fontSize: "14px",
                                      lineHeight: "18.23px",
                                      letterSpacing: "0%",
                                      color: "#00000080",
                                      opacity: 1,
                                    },
                                  }}
                                  helperText={countryError}
                                  // helperText={countryError ? "Please select a country" : ""}
                                />
                              )}
                            />
                            {countryError ? (
                              <p
                                style={{
                                  color: "red",
                                  margin: "0px",
                                  padding: "0px",
                                }}
                              >
                                select country
                              </p>
                            ) : (
                              ""
                            )}
                          </Grid>

                          <Grid id="mainState" item xs={4}>
                            <Autocomplete
                              sx={{
                                width: "100%",
                                "& .MuiOutlinedInput-root": {
                                  // height: '40px',
                                  width: "100%",

                                  // fontSize: '12px',

                                  background: "#FFFFFF",
                                  border: "0.5px solid #bdbdbd",
                                  color: "#00000080",
                                  borderRadius: "5px",
                                  padding: "5px 0px 5px 15px",

                                  fontFamily: "SF Pro Display",
                                  fontWeight: 300,
                                  fontSize: "14px",
                                  lineHeight: "18.23px",
                                  letterSpacing: "0%",

                                  opacity: 1,
                                  height: "44px",
                                  // borderRadius: '12px',
                                  // border: '1px solid #00000080',
                                  "& fieldset": { borderColor: "transparent" },
                                  "&:hover fieldset": {
                                    borderColor: "transparent",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "transparent",
                                  },
                                },
                              }}
                              options={states}
                              // value={selectedState || null} // Ensure the selected value updates
                              value={selectedState || null}
                              getOptionLabel={(option) => option.name}
                              onChange={(event, newValue) => {
                                if (newValue && selectedCountry) {
                                  setStateIso2(newValue.iso2);
                                  setSelectedState(newValue);
                                  setSelectedStateValue(newValue.name);
                                  setStateError(false);

                                  setSelectedCity("");
                                  setSelectedCityValue("");
                                  setCityError(false);
                                  setLocationError(false);
                                } else {
                                  setStateIso2("");
                                  setSelectedState("");
                                  setStateError(true);

                                  setSelectedCity("");
                                  setSelectedCityValue("");
                                  setCityError(false);
                                  setLocationError(false);
                                }
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="State"
                                  sx={{
                                    "& .MuiInputBase-input::placeholder": {
                                      fontFamily: "SF Pro Display",
                                      fontWeight: 300,
                                      fontSize: "14px",
                                      lineHeight: "18.23px",
                                      letterSpacing: "0%",
                                      color: "#00000080",
                                      opacity: 1,
                                    },
                                  }}
                                  helperText={stateError}
                                />
                              )}
                              disabled={!selectedCountry} // Disable until a country is selected
                            />
                            {stateError ? (
                              <p
                                style={{
                                  color: "red",
                                  margin: "0px",
                                  padding: "0px",
                                }}
                              >
                                select state
                              </p>
                            ) : (
                              ""
                            )}
                          </Grid>

                          <Grid id="mainCity" item xs={3.9}>
                            <Autocomplete
                              sx={{
                                width: "100%",
                                "& .MuiOutlinedInput-root": {
                                  // height: '40px',
                                  width: "100%",

                                  // fontSize: '12px',

                                  background: "#FFFFFF",
                                  border: "0.5px solid #bdbdbd",
                                  color: "#00000080",
                                  borderRadius: "5px",
                                  padding: "0px 0px 0px 15px",

                                  fontFamily: "SF Pro Display",
                                  fontWeight: 300,
                                  fontSize: "14px",
                                  lineHeight: "18.23px",
                                  letterSpacing: "0%",

                                  opacity: 1,

                                  height: "44px",
                                  // // borderRadius: '12px',
                                  // border: '1px solid #00000080',
                                  "& fieldset": { borderColor: "transparent" },
                                  "&:hover fieldset": {
                                    borderColor: "transparent",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "transparent",
                                  },
                                },
                              }}
                              // value={selectedCity || null} // Ensure the selected value updates
                              value={
                                selectedCity || null
                                // selectedCity || (editAijd === true ? cityAi : null)
                              }
                              options={cities}
                              getOptionLabel={(option) => option.name}
                              onChange={(event, newValue) => {
                                console.log("Selected City:", newValue);
                                if (newValue) {
                                  setSelectedCity(newValue);
                                  setSelectedCityValue(newValue.name);
                                  setCityError(false);
                                } else {
                                  setSelectedCity("");
                                  setCityError(true);
                                }
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="City"
                                  sx={{
                                    "& .MuiInputBase-input::placeholder": {
                                      fontFamily: "SF Pro Display",
                                      fontWeight: 300,
                                      fontSize: "14px",
                                      lineHeight: "18.23px",
                                      letterSpacing: "0%",
                                      color: "#00000080",
                                      opacity: 1,
                                    },
                                  }}
                                  helperText={cityError}
                                />
                              )}
                              disabled={!selectedState} // Disable until a state is selected
                            />
                            {cityError ? (
                              <p
                                style={{
                                  color: "red",
                                  margin: "0px",
                                  padding: "0px",
                                }}
                              >
                                select city
                              </p>
                            ) : (
                              ""
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Grid
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      padding: "10px",
                    }}
                  >
                    {/* Left side button */}
                    <Button
                      onClick={submitFormAi}
                      sx={{
                        fontFamily: "SF Pro Display",
                        fontWeight: 500,
                        fontSize: "14px",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: "rgba(28, 28, 30, 1)",
                        boxShadow: "0px 0px 8px 0px rgba(28, 28, 30, 0.08)",
                        border: "0.5px solid rgba(28, 28, 30, 0.25)",
                        borderRadius: "50px",
                        textTransform: "none",
                        padding: "9px 20px",
                        "&:hover": {
                          background: "rgba(2, 132, 199, 1)",
                          color: "#fff",
                          border: "0.5px solid transparent",
                        },
                      }}
                    >
                      <AutoAwesomeIcon sx={{ color: "#ffeb3b" }} /> &nbsp;&nbsp;
                      Create Job Description
                    </Button>

                    {/* Right side button */}
                  </Grid>
                </DialogActions>
              </Dialog>
            </React.Fragment>
            {/* preview ends here.. */}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            {uploadedFileName && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                }}
              >
                {uploadSuccess && <CheckCircle size={16} color="green" />}
                <span>{uploadedFileName} uploaded</span>
              </div>
            )}
          </div>
        </div>

        <Grid
          container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid item>
            <button
              // onClick={handleGenerate}
              onClick={handleGenerateAijd}
              disabled={isGenerating}
              style={{
                marginTop: "5px",
                padding: "8px 20px",
                background: isGenerating
                  ? "linear-gradient(135deg, #ccc, #999)"
                  : "linear-gradient(135deg, #2196f3, #21cbf3)",
                border: "none",
                borderRadius: "12px",
                color: "white",
                cursor: isGenerating ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "16px",
                fontWeight: "600",
                boxShadow: "0 4px 15px rgba(33, 150, 243, 0.3)",
                transition: "all 0.3s ease",
              }}
            >
              <Sparkles size={20} />
              {isGenerating ? "Generating..." : "Generate with AI"}
            </button>
          </Grid>
        </Grid>

        {/* Footer */}
        <div
          style={{
            marginTop: "10px",
            fontSize: "12px",
            color: "#999",
            textAlign: "center",
          }}
        >
          © 2025 aipoint.ai • Empowering Recruiters with AI •
          <a
            href="mailto:support@aipoint.ai"
            style={{ color: "#2196f3", textDecoration: "none" }}
          >
            support@aipoint.ai
          </a>
        </div>
      </div>

      <Backdrop
        sx={(theme) => ({
          color: "#fff",
          backgroundColor: "rgba(240, 250, 255, 0.81)",
          zIndex: theme.zIndex.drawer + 1,
        })}
        open={openGeneration}
        // onClick={handleCloseGeneration}
      >
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          sx={{ minHeight: "100vh", textAlign: "center" }}
        >
          {/* Image Box */}
          <Grid item>
            <Box>
              <img
                src="/assets/static/SVG/sparkle.svg"
                alt="Sparkle"
                style={{
                  width: "220px",
                  height: "auto",
                  animation: isAnimated
                    ? ""
                    : "blink 1.2s infinite ease-in-out",
                }} // Adjust size as needed
              />
            </Box>
          </Grid>

          {/* Text Box */}
          <Grid item>
            <Box sx={{ maxWidth: "600px", px: 2 }}>
              <h1
                style={{
                  // fontSize: '36px',
                  // fontWeight: 700,
                  marginBottom: "15px",
                  // background: 'linear-gradient(135deg, #1976d2, #21cbf3)',
                  // WebkitBackgroundClip: 'text',
                  // WebkitTextFillColor: 'transparent',

                  fontFamily: "SF Pro Display",
                  fontWeight: 600,
                  fontSize: "24px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "rgba(2, 132, 199, 1)",
                }}
              >
                Generating Your Smart Job Description…
              </h1>
              <p
                style={{
                  fontFamily: "SF Pro Display",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "rgba(28, 28, 30, 1)",
                }}
              >
                We’re analyzing your inputs, refining the language, and
                structuring the perfect JD tailored to your needs. Hang tight —
                this will just take a moment!
              </p>
            </Box>
          </Grid>

          {showButtons && (
            <>
              <Grid
                container
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "40px",
                }}
              >
                <Button
                  sx={{
                    fontFamily: "SF Pro Display",
                    fontWeight: 500,
                    fontSize: "14px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    color: "rgba(28, 28, 30, 1)",
                    boxShadow: "0px 0px 8px 0px rgba(28, 28, 30, 0.08)",
                    border: "0.5px solid rgba(28, 28, 30, 0.25)",
                    borderRadius: "50px",
                    textTransform: "none",
                    padding: "10px 20px",
                    "&:hover": {
                      background: " rgba(2, 132, 199, 1)",
                      color: "#fff",
                      border: "0.5px solid transparent",
                    },
                  }}
                  onClick={handleCloseGeneration}
                >
                  <KeyboardBackspaceIcon /> &nbsp;&nbsp;Back to canvas
                </Button>
                <Button
                  onClick={handleClickOpenPreview("paper")}
                  sx={{
                    fontFamily: "SF Pro Display",
                    fontWeight: 500,
                    fontSize: "14px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    color: "rgba(28, 28, 30, 1)",
                    boxShadow: "0px 0px 8px 0px rgba(28, 28, 30, 0.08)",
                    border: "0.5px solid rgba(28, 28, 30, 0.25)",
                    borderRadius: "50px",
                    textTransform: "none",
                    padding: "9px 20px",
                    "&:hover": {
                      background: " rgba(2, 132, 199, 1)",
                      color: "#fff",
                      border: "0.5px solid transparent",
                    },
                  }}
                >
                  <AutoAwesomeIcon sx={{ color: "#ffeb3b" }} /> &nbsp; &nbsp;
                  Preview Job Description
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      </Backdrop>
    </div>
  );
};

export default AIjdCreation;
