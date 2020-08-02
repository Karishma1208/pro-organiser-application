const months = [
    'January',
    'Febuary',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  
  export const convertDate = date => {
    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
  };