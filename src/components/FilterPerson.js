import React from 'react'

const FilterPerson = (props) => {
  return (
    <div>
      rajaa näytettäviä <input id="namefilter" onChange={props.handleFilteredPersons} />
    </div>
  )
}

export default FilterPerson
