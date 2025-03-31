export const fetchSapData = async () => {
  const username = 'admincpi@SFCPART000830';
  const password = 'Cloud@123';
  
  // Encode the username and password in Base64
  const encodedCredentials = Buffer.from(`${username}:${password}`).toString('base64');
  
  // API URLs
  const apiUrlCandidate = 'https://apisalesdemo8.successfactors.com/odata/v2/Candidate?$select=jobsApplied/jobRequisition/jobReqId,resume/fileContent,firstName,middleName,lastName,candidateId,currentCompany,currentTitle,dateofAvailability,externalCandidate,PreviousWorkExperience/startDate,PreviousWorkExperience/currentlyEmployedNav/externalCode,PreviousWorkExperience/employer,PreviousWorkExperience/endDate,PreviousWorkExperience/leaveReason,PreviousWorkExperience/positionTitle,education/majorNav/externalCode,education/institutionNav/externalCode,education/degreeNav/externalCode,languages/languageNav/externalCode&$expand=jobsApplied/jobRequisition,resume,PreviousWorkExperience,PreviousWorkExperience/currentlyEmployedNav,education/majorNav,education/institutionNav,education/degreeNav,languages/languageNav&$format=json';

  const apiUrlJobProfile = 'https://apisalesdemo8.successfactors.com/odata/v2/JobRequisition?$select=jobProfile/longDesciptions/desc_en_US,jobProfile/shortDesciptions/desc_en_US,jobProfile/certificationContents,jobProfile/competencyContents,jobProfile/educationDegreeContents,jobProfile/educationMajorContents,jobProfile/jobResponsibilityContents,jobProfile/physicalReqContents,jobProfile/relevantIndustryContents,jobProfile/skillContents,jobReqId&$expand=jobProfile/longDesciptions,jobProfile/shortDesciptions,jobProfile/competencyContents,jobProfile/certificationContents,jobProfile/certificationContents,jobProfile/educationDegreeContents,jobProfile/educationMajorContents,jobProfile/jobResponsibilityContents,jobProfile/physicalReqContents,jobProfile/relevantIndustryContents,jobProfile/skillContents&$format=json';
  
  try {
    // Fetch Candidate data
    const responseCandidate = await fetch(apiUrlCandidate, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${encodedCredentials}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!responseCandidate.ok) {
      throw new Error('Error fetching candidate data');
    }
    
    const candidateData = await responseCandidate.json();

    // Fetch JobProfile data
    const responseJobProfile = await fetch(apiUrlJobProfile, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${encodedCredentials}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!responseJobProfile.ok) {
      throw new Error('Error fetching job profile data');
    }

    const jobProfileData = await responseJobProfile.json();
    console.log("candidate", candidateData)
    // Return combined data
    return {
      candidateData,
      jobProfileData
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return null; // Return null if there was an error
  }
};
