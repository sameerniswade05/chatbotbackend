// Use async/await to handle asynchronous operations
export const fetchSapData = async () => {
    const username = 'admincpi@SFCPART000830';
    const password = 'Cloud@123';
    
    // Encode the username and password in Base64
    const encodedCredentials = Buffer.from(`${username}:${password}`).toString('base64');
  
    // Dummy API URL (Reqres)
    const apiUrl = 'https://apisalesdemo8.successfactors.com/odata/v2/JobRequisition?$select=jobProfile/longDesciptions/desc_localized,jobProfile/shortDesciptions/desc_localized,jobProfile/certificationContents,jobProfile/competencyContents,jobProfile/educationDegreeContents,jobProfile/educationMajorContents,jobProfile/jobResponsibilityContents,jobProfile/physicalReqContents,jobProfile/relevantIndustryContents,jobProfile/skillContents,jobReqId,jobApplications/candidate/firstName,jobApplications/candidate/middleName,jobApplications/candidate/lastName,jobApplications/candidate/candidateId,jobApplications/candidate/PreviousWorkExperience/startDate,jobApplications/candidate/PreviousWorkExperience/positionTitle,jobApplications/candidate/education/degreeNav/externalCode,jobApplications/candidate/languages/languageNav/externalCode&$expand=jobProfile/longDesciptions,jobProfile/shortDesciptions,jobProfile/certificationContents,jobProfile/certificationContents,jobProfile/educationDegreeContents,jobProfile/educationMajorContents,jobProfile/jobResponsibilityContents,jobProfile/physicalReqContents,jobProfile/relevantIndustryContents,jobProfile/skillContents,jobApplications/candidate/PreviousWorkExperience,jobApplications/candidate/education/degreeNav,jobApplications/candidate/languages/languageNav&$format=json';
  
    try {
      const response = await fetch(apiUrl, {
        method: 'GET', // Change method to GET
        headers: {
          'Authorization': `Basic ${encodedCredentials}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data; // Return the fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
      return null; // Return null if there was an error
    }
  };
  
