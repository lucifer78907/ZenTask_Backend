exports.getDate = (currDate,todoDate) => {
      // details of the date on which todo is beign added
  const [day,month,year] = [todoDate.getDate(),todoDate.getMonth()+1,todoDate.getFullYear()]
  // details of currDate 
  const [currDay,currMonth,currYear] = [currDate.getDate(),currDate.getMonth()+1,currDate.getFullYear()]
  if(month===currMonth && year===currYear)
  {
    if(currDay===day)
        return `Today`;
    else if((currDay+1)===day)
        return `Tomorrow`;
    else 
        return `Future`;
  }
  else
    return `Future`;
}