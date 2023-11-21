// function formatDate(inputDateString) {
//     // Remove commas and convert dashes to spaces from the input date string
//     const sanitizedDateString = inputDateString.replace(/,|-/g, ' ');
  
//     // Split the input date string into parts
//     const dateParts = sanitizedDateString.split(' ');
  
//     // Extract the date part
//     const day = dateParts[0];
//     const month = dateParts[1];
//     const year = dateParts[2];
  
//     // Convert the formatted date to a Date object
//     const dateObject = new Date(`${month} ${day}, ${year}`);
  
//     // Format the date to "DD Mon YYYY"
//     const formattedDate = dateObject.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  
//     return formattedDate;
//   }
  
//   // Example usage:
//   const formattedDate1 = formatDate('Nov 28, 2023');
//   console.log(formattedDate1); // Output: '28 Nov 2023'
  
//   const formattedDate2 = formatDate('13-Oct-2023');
//   console.log(formattedDate2); // Output: '13 Oct 2023'
  
//   const formattedDate3 = formatDate('28-Nov-2023 4:30 pm (ACT Local Time)');
//   console.log(formattedDate3); // Output: '28 Nov 2023'

function formatDate(inputDateString) {
    // Remove commas and convert dashes to spaces from the input date string
    const sanitizedDateString = inputDateString.replace(/,|-/g, ' ');
  
    // Split the input date string into parts
    const dateParts = sanitizedDateString.split(' ');
  
    // Extract the date part
    const day = dateParts[0];
    const month = dateParts[1];
    const year = dateParts[2];
  
    // Convert the formatted date to a Date object
    const dateObject = new Date(`${month} ${day} ${year}`);
  
    // Format the date to "DD Mon YYYY"
    const formattedDate = dateObject.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  
    return formattedDate;
  }
  
  // Example usage:
  const formattedDate1 = formatDate('Nov 28, 2021');
  console.log(formattedDate1); // Output: '28 Nov 2021'
  
  const formattedDate2 = formatDate('13-Oct-2023');
  console.log(formattedDate2); // Output: '13 Oct 2023'
  
  const formattedDate3 = formatDate('28-Nov-2023');
  console.log(formattedDate3); // Output: '28 Nov 2023'
  