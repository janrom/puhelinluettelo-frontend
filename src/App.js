import React from 'react';
import './index.css'
import FilterPerson from './components/FilterPerson'
import AddPerson from './components/AddPerson'
import ShowPersons from './components/ShowPersons'
import Notification from './components/Notification'
import personService from './services/person'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      persons: [],
      filteredPersons: [],
      newName: '',
      newNumber: '',
      notification: null,
      notificationStyle: null
    }
  }

  // lataa data json-palvelimelta ja aseta komponentin tilaksi
  componentDidMount() {
    personService
      .getAll()
      .then(persons => {
        this.setState({ persons })
      })
      .catch(error => this.showNotification(`Valitettavasti kontaktien lataaminen palvelimelta epaonnistui`, 'errorNotification'))      
  }
  
  /* tarkistaa onko annettu nimi jo puhelinluettelossa:
  * jos on -> paivita olemassaoleva
  * jos ei -> lisaa uusi */  
  addOrUpdatePerson = (event) => {
    event.preventDefault()    
    
    const personsArray = this.state.persons.filter(p => p.name === this.state.newName)    
    if (personsArray.length > 0) {      
      this.updatePerson(personsArray[0])
    }
    else {
      this.addPerson()      
    }    
  }

  // lisää uusi henkilo puhelinluetteloon
  addPerson = () => {
    // luo uusi alkio
    const personObject = {      
      name: this.state.newName,
      number: this.state.newNumber
    }    

    // lisaa uuden henkilo-objektin json-palvelimelle seka komponentin tilakenttaan
    personService
      .create(personObject)
      .then(response => {        
        this.setState({ 
          persons: this.state.persons.concat(response),
          newName: '',
          newNumber: ''
        })
        this.showNotification(`Lisattiin ${response.name}`, 'successNotification')
        this.clearInput()
      })            
      .catch(error => this.showNotification(`Valitettavasti lisaaminen epaonnistui`, 'errorNotification'))    
  }

  // paivittaa puheliluottelossa olevan nykyisen henkilon tiedot
  updatePerson = (person) => {    
    person.number = this.state.newNumber
    
    // korvaa nimea vastaavan henkilo-objektin json-palvelimelle seka komponentin tilakenttaan
    personService
      .update(person.id, person)      
      .then(response => {        
        this.setState({
          persons: this.state.persons.map(p => p.name !== response.name ? p : response),
          newName: '',
          newNumber: ''
        })        
        this.showNotification(`Paivitettiin ${response.name}`, 'successNotification')
        this.clearInput()
      })      
      .catch(error => {
        // kontakti on jo poistettu palvelimelta mutta on viela komponentin tilana, lisaa kontakti uudelleen palvelimella ja paivita komponentin tila
        if (error.message.indexOf('404') !== -1) {
          personService
            .create(person)
            .then(this.setState({ persons: this.state.persons.map(p => p.id !== person.id ? p : person) }))
            .then(this.clearInput())
            .catch(error => this.showNotification('Valitettavasti paivittaminen epaonnistui', 'errorNotification'))          
        }
        else {
          this.showNotification('Valitettavasti paivittaminen epaonnistui', 'errorNotification')        
        }        
      })    
  }

  /*poista kontakti palvelimelta ja paivita komponentin tila seka clientin nakyma. 
  * eventin arvo on kontaktin id, joka poistetaan */
  removePerson = (event) => {       
    personService
      .remove(event)
      .then(response => personService.getAll())
      .then(response => {
        this.setState({ persons: response })
        this.showNotification('Henkilo poistettu', 'successNotification')
      })
      .catch(error => {
        // kontakti on jo poistettu palvelimelta mutta on viela komponentin tilana, poista kontakti komponentin tilasta kaikessa hiljaisuudessa
        if (error.message.indexOf('404') !== -1) {          
          this.setState({ persons: this.state.persons.filter( p => p.id !== event ) })
        }
        else {
          this.showNotification('Valitettavasti poistaminen epaonnistui', 'errorNotification')        
        }
      })      
  }
  
  // päivittää lomakkeen input-kentän arvon luokan tila-objektiin
  handleNameChange = (event) => {
    this.setState({ newName: event.target.value })    
  }

  handleNumChange = (event) => {
    this.setState({ newNumber: event.target.value })
  }

  // tyhjennä lomakkeen input-kentät
  clearInput = () => {    
    document.getElementById('name').value = ''
    document.getElementById('phonenumber').value = ''
  }

  // luo taulukko suodatetuista henkilöistä ja aseta se tila-objektin arvoksi
  handleFilteredPersons = (event) => {
    const filtered = this.state.persons.filter(person => person.name.toLowerCase().includes(event.target.value.toLowerCase()))

    this.setState({ filteredPersons: filtered })
  }

  // tee tarkistukset lomakkeen syotteelle
  validateInput = (event) => {    
    if (this.state.newName.length === 0) {
      event.preventDefault()
      this.showNotification('Annettu nimi ei ole kelvollinen', 'errorNotification')
    }    
  }

  // aseta ilmoituksen teksti ja tyyli, uudelleen renderointi nayttaa viestin, kosk arvo ei null
  showNotification = (msg, style) => {
    this.setState({
      notification: msg,
      notificationStyle: style
    })
    setTimeout(() => {
      this.setState({
        notification: null,
        notificationStyle: null
      })
    }, 5000)
  }
  
  render() {
    // valitse näytetäänkö koko luettelo vai suodatettu luettelo
    const personArray = this.state.filteredPersons.length === 0 ? this.state.persons : this.state.filteredPersons
    return (
      <div>
        <h1>Puhelinluettelo</h1>
        <Notification style={this.state.notificationStyle} message={this.state.notification} />
        <FilterPerson handleFilteredPersons={this.handleFilteredPersons.bind(this)} />
        <h2>Lisää uusi kontakti / muuta kontaktin numeroa</h2>
        <AddPerson addOrUpdatePerson={this.addOrUpdatePerson.bind(this)} handleNameChange={this.handleNameChange.bind(this)} handleNumChange={this.handleNumChange.bind(this)} 
          validateInput={this.validateInput.bind(this)} />
        <h2>Numerot</h2>
        <ShowPersons personArray={personArray} removePerson={this.removePerson}/>
      </div>
    )
  }
}

export default App;
