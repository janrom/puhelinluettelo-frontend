import React from 'react'

const ShowPersons = (props) => {  
  return(
    <table>
      <tbody>
        {props.personArray.map( person => {
          return(
            <tr key={person.name}>
              <td>{person.id}</td>
              <td>{person.name}</td>
              <td>{person.number}</td> 
              <td><button onClick={() => props.removePerson(person.id)}>Poista</button></td>
            </tr>              
          )
        })}
      </tbody>
    </table>
  )
}

export default ShowPersons