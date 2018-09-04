import React from 'react'
import { Modal, Header, Form, Input, Button, Message } from 'semantic-ui-react'

import { ABI_DASHBOARD, ABI_CAMPAIGN, ADDRESS } from '../constants/constants'

class DonateModal extends React.Component {
  constructor(props){
    super(props)
    this.state = {amount: '', processing: false, success: false, error: false, errorMessage: ''}

    this.handleAmountChange = this.handleAmountChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleAmountChange(e) {
    this.setState({amount: e.target.value})
  }
  async handleSubmit() {
    console.log('Submit')
    this.setState({processing: true, success: false, error: false})
    if(this.state.amount === '' || isNaN(this.state.amount)) {
      this.setState({error: true, processing: false, errorMessage: 'Please enter a number.'})
    }
    else if(this.state.amount <= 0){
      this.setState({error: true, processing: false, errorMessage: 'Must be > 0.'})
    }
    else{
      await this.donate(this.props.id, this.state.amount);
      this.setState({processing: false});
    }
  }
  donate = async (id, amount) => {
    const Dashboard = window.web3.eth.contract(ABI_DASHBOARD);
    let dashboardInstance = Dashboard.at(ADDRESS);
    return new Promise((resolve, reject) => {
      dashboardInstance.makeContribution(id, {
        value: amount
      }, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data.toString())
        }
      });
    });
  }
  render() {
    return (
      <Modal trigger={<Button color='green' style={{float: 'right'}}>Donate</Button>}>
        <Modal.Header>Make A Contribution</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Header>Choose Amount</Header>
            <Form loading={this.state.processing}>

              {this.state.error ? <Header as='h4' color='red'>{this.state.errorMessage}</Header> : null}
              <Input placeholder='wei' onChange={this.handleAmountChange} value={this.state.amount}/>
              <Button style={{marginLeft: '1rem'}} onClick={this.handleSubmit}>Submit</Button>
              <Message error header='Invalid' content={this.state.errorMessage}/>
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    )
  }
}

export default DonateModal