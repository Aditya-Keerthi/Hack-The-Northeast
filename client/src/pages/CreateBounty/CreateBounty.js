import React, { Component } from 'react';
// import PublishIcon from '@material-ui/icons/Publish';
import "./CreateBounty.css"

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class CreateBounty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bufferTrainingData: null,
            bufferModel: null,
            name: "",
            description: "",
            requirements: ""
        }
        this.fileInputRef1 = React.createRef();
        this.fileInputRef2 = React.createRef();
    }

    clearFile = () => {
        this.setState({
            bufferTrainingData: null,
            bufferModel: null,
            name: "",
            description: "",
            accuracy: null
        })
    }

    openFileDialog1 = () => {
        if (this.props.disabled) return;
        this.fileInputRef1.current.click();
    }

    openFileDialog2 = () => {
        if (this.props.disabled) return;
        this.fileInputRef2.current.click();
    }

    onTrainingDataAdded = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onloadend = () => {
            this.setState({
                bufferTrainingData: Buffer(reader.result)
            })
            console.log("bufferTraining: ", this.state.bufferTrainingData);
        }
    }

    onModelAdded = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onloadend = () => {
            this.setState({
                bufferModel: Buffer(reader.result)
            })
            console.log("bufferModel: ", this.state.bufferModel);
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        var raw = JSON.stringify({
            "userhash": this.props.account,
            "name":"Detecting COVID",
            "description":"COVID-19 is meaniee",
            "requirements":{
                "accuracy": 90
            },
            "trainingdata": this.state.bufferTrainingData,
            "model": this.state.bufferModel,
            "amount": 123
        });
        
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        
        fetch("http://localhost:3005/addBounty", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

    render() { 
        return (
            <div className="create-bounty-page">
                <div className="create-bounty-title">
                    Create Bounty
                </div>
                <div className="create-bounty-content">
                    <div style={{width: "100%", display: "flex", justifyContent : "space-evenly", marginTop : "50px"}}>
                        <TextField id="standard-basic" label="Name" />
                        <TextField id="standard-basic" label="Amount" />
                    </div>
                    <div style={{width: "85%", display: "flex", justifyContent : "space-evenly", marginTop : "50px"}}>
                        <TextField multiline={true} fullWidth id="standard-basic" label="Description" />
                    </div>
                    <div style={{width: "85%", display: "flex", justifyContent : "space-evenly", marginTop : "50px"}}>
                        <TextField multiline={true} fullWidth id="standard-basic" label="Requirements" />
                    </div>

                    <div style={{display: "flex", justifyContent : "space-evenly", width: "100%", marginTop : "30px"}}>
                        <input 
                            ref={this.fileInputRef1}
                            className="file-input"
                            type="file"
                            onChange={this.onTrainingDataAdded}
                            id="raised-button-filee"
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="raised-button-filee">
                            <Button variant="contained" color="primary" component="span">
                                Upload Training Data
                            </Button>
                        </label> 

                        <input 
                            ref={this.fileInputRef2}
                            className="file-input"
                            type="file"
                            onChange={this.onModelAdded}
                            id="raised-button-file"
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="raised-button-file">
                            <Button variant="contained" color="primary" component="span">
                                Upload A Model
                            </Button>
                        </label> 
                    </div>
                    <Button onClick={this.onSubmit} variant="contained" color="primary" style={{marginTop : "30px", marginBottom : "30px"}}>
                        Submit
                    </Button>
                </div>
            </div>
        );
    }
}
 
export default CreateBounty;