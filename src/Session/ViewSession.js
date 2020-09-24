import React,{Component} from "react";
import axios from "axios";
import {Container, Spinner, Table} from "react-bootstrap";
import SessionNav from "./SessionNav";
const Session = props => (
    <tr>
        {
            props.session != null ? <td style={{fontSize: '15px'}}>{props.session.GeneratedSession.split('\n').map( (it, i) => <div key={'x'+i}>{it}</div> )}</td> :
                <td style={{fontSize: '15px'}}>{props.sessions.split('\n').map( (it, i) => <div key={'x'+i}>{it}</div> )}</td>
        }
    </tr>
)

class ViewSession extends Component{

        constructor(props) {
            super(props);

            this.state = {
                SessionDetails:[],
                loading: true,
                selectedType: 'Lecturer',
                SearchWord: '',
                SelectedSessions: []
            };

            this.onRadioBtnValueChange = this.onRadioBtnValueChange.bind(this);
            this.onFilter = this.onFilter.bind(this);
            this.SearchMethod = this.SearchMethod.bind(this);

        }
    componentDidMount() {
        axios.get('http://localhost:8000/generatedSession/viewGeneratedSession')
            .then(res => {
                this.setState({
                    SessionDetails: res.data,
                    loading:false
                })
            });
    }

    SessionList() {
        return this.state.SessionDetails.map(sessionD => {
            return <Session session={sessionD} key={sessionD._id}/>;
        })
    }

    SessionListSelected() {
        return this.state.SelectedSessions.map(sessionD => {
            return <Session sessions={sessionD} />;
        })
    }

    onRadioBtnValueChange(e){
            console.log(e.target.value);
        this.setState({
            selectedType: e.target.value
        });

    }

    SearchMethod(e){

            this.setState({
                SelectedSessions : []
            })
            if(this.state.SearchWord !== ''){
                this.state.SessionDetails.map(sess => {
                    console.log(sess.GeneratedSession.toString())
                    if(sess.GeneratedSession.toString().indexOf(this.state.SearchWord) >= 0){
                        console.log(sess.GeneratedSession.toString())
                        this.setState((prevState) => ({
                            SelectedSessions : [sess.GeneratedSession, ...prevState.SelectedSessions]
                        }))
                        // this.setState({
                        //     SelectedSessions : this.state.SelectedSessions.concat(sess.GeneratedSession)
                        // })
                    }
                })
            }
            this.state.SelectedSessions.map(Sess => {
                console.log(Sess)
            })
    }

    onFilter(e){
         this.setState({SearchWord: e.target.value})
    }

    render() {
        return(
            <div id="page-container" className='main'>
                <SessionNav/><br/>

                <Container>
                    <h3> Session Details </h3><br/>
                    <div className="form-group mx-sm-3 mb-2 text-right">
                        <label style={{fontSize: '16px', color: "mediumslateblue"}} htmlFor="LecturerSelectForSearch">
                            <input
                                type="radio"
                                id="Radiobtn"
                                value="Lecturer"
                                checked={this.state.selectedType === "Lecturer"}
                                onChange={this.onRadioBtnValueChange}
                            /><t/>
                            Lecturer
                        </label> <t/>
                        <label style={{fontSize: '16px', color: "mediumslateblue"}} htmlFor="SubjectSelectForSearch">
                            <input
                                type="radio"
                                id="Radiobtn"
                                value="Subject"
                                checked={this.state.selectedType === "Subject"}
                                onChange={this.onRadioBtnValueChange}
                            /><t/>
                            Subject
                        </label> <t/>
                        <label style={{fontSize: '16px', color: "mediumslateblue"}} htmlFor="TagSelectForSearch">
                            <input
                                type="radio"
                                id="Radiobtn"
                                value="Tag"
                                checked={this.state.selectedType === "Tag"}
                                onChange={this.onRadioBtnValueChange}
                            /><t/>
                            Tag
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="searchOption"
                            placeholder="Enter Text"
                            value={this.state.SearchWord}
                            onChange={this.onFilter}
                            required/>
                        <button
                            type="button"
                            onClick={this.SearchMethod}
                            className="btn btn-info btn-s"
                        >
                            Search
                        </button>
                    </div>
                    <Table responsive>
                        <thead>
                        {this.state.loading ? <center><Spinner animation="border" /></center> :
                            <tr>
                                <th style={{fontSize: '15px'}}>Session</th>
                            </tr>
                        }
                        </thead>
                        <tbody>
                        {this.state.SearchWord != '' ? this.SessionListSelected() : this.SessionList()}
                        {/*{this.SessionList()}*/}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}
export default ViewSession;
