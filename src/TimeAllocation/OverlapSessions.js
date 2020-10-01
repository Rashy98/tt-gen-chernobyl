import React,{Component} from "react";
import axios from "axios";
import TagNav from "./timeNav"
// import RoomAllocationMain from "./RoomAllocationMain";
import location from "../assets/css/location.css"
import stat from "../assets/css/stats.css";

class OverlapSessions extends Component{
    constructor(props) {
        super(props);

        this.state={
            rooms:[{room:""}],
            Newrooms:[],
            tags:[],
            psession1:"",
            psession2:"",
            sessions:[{session:""}],
            secondsessions:[{session:""}],
            sessionData:[],
            selectedTag:"",

        }

        this.handleSessionsNameChange = this.handleSessionsNameChange.bind(this);
        // this.handleAddSessions = this.handleAddSessions.bind(this);
        // this.handleRemoveSession = this.handleRemoveSession.bind(this);
        this.onChangeSession = this.onChangeSession.bind(this);
        this.onChangeSession1 = this.onChangeSession1.bind(this);
        // this.onChangeTag = this.onChangeTag.bind(this);
        this.GetID = this.GetID.bind(this);
        this.AddSessionAllocation = this.AddSessionAllocation.bind(this);
    }

    handleSessionsNameChange = idx => evt => {
        const newDay = this.state.sessoins.map((session, ridx) => {
            if (idx !== ridx)
                return session;
            return { ...session, session: evt.target.value };
        });

        this.setState({ sessoins: newDay });
    };


    onChangeSession(e) {
        let index = e.target.selectedIndex;
        let el = e.target.childNodes[index];
        let selectedId = el.getAttribute('id');


        this.setState({
            selectedSession: e.target.value,
            S_session: e.target.value,
            selectedID: selectedId,

        })

        console.log(selectedId, e.target.value)

    }
    onChangeSession1(e) {
        let index1 = e.target.selectedIndex;
        let el1 = e.target.childNodes[index1];
        let selectedId1 = el1.getAttribute('id');


        this.setState({
            selectedSession1: e.target.value,
            S_session1: e.target.value,
            selectedID1: selectedId1,

        })

        console.log(selectedId1, e.target.value)

    }

    selectedID(id){
        this.setState(
            {
                selectedID : id
            }
        )
    }
    selectedID1(id){
        this.setState(
            {
                selectedID1 : id
            }
        )
    }


    componentDidMount() {
        axios.get('http://localhost:8000/generatedSession/viewGeneratedSession')
            .then(response => {
                this.setState({
                    sessions: response.data,
                    secondsessions:response.data,


                })
                console.log(this.state.sessions[0].GeneratedSession);
            })
        axios.get('http://localhost:8000/session/viewSession')
            .then(response => {
                this.setState({sessData: response.data})
                console.log(response.data);
            })
    }

    GetID(){
        let newSessions = [];
        this.state.sessions.map(session =>{
            newSessions.push(session.session);
        })

        return newSessions;

    }

    AddSessionAllocation(e) {
        e.preventDefault();


        // let tagId =  this.state.tags.map(tag=>{
        //     if(tag.tag === this.state.selectedTag){
        //         return tag._id
        //     }
        // })
        const Ovrsession = {
            _id:this.state.selectedID,
            NoOverLapSessionID:  this.state.selectedID1
        }
        const Ovrsession1 = {
            _id:this.state.selectedID1,
            NoOverLapSessionID:  this.state.selectedID
        }

        // const times = {
        //     _id:sessionId,
        //     times:  this.state.times
        // }
        console.log(Ovrsession);
        console.log(Ovrsession1);
        axios.post("http://localhost:8000/session/pushOvrSession/",Ovrsession)
            .then(res => console.log(res.data));
        axios.post("http://localhost:8000/session/pushOvrSession1/",Ovrsession1)
            .then(res => console.log(res.data));

        alert('Sessions should not Overlap Allocated!');
        this.setState({
            selectedSession:" ",
            selectedSession1:" ",

        })

    }

    render() {
        return(
            <div className="main">
                <TagNav/>
                <h3> Sessions Should not Overlap Allocation</h3>
                <div className="form">

                    <form onSubmit={this.AddSessionAllocation}>

                        {/*<form className="form-inline">*/}

                        <h5 className='mt-3'>Select Sessions to Allocate</h5>

                        {/*</form>*/}
                        {/*{this.state.groups.map((group, idx) => (*/}

                        <div className="room">

                            {/*<form className="form-inline mt-2">*/}

                            <select className="form-control w-75 mt-2" id={this.state.selectedID}
                                    value={this.state.selectedSession}
                                    onChange={this.onChangeSession}
                                    required
                            >
                                <option selected style={{fontSize: '15px'}}value="">Choose Session...</option>
                                {this.state.sessions.map((sess,id) => {
                                    return (
                                        <option value={sess.GeneratedSession} id={sess.GeneratedSessionID}>
                                            {sess.GeneratedSession}
                                        </option>
                                    )
                                })}
                            </select>


                            {/*</form>*/}
                            {/*<form className="form-inline mt-2">*/}

                            <select className="form-control w-75 mt-2" id={this.state.selectedID1}
                                    value={this.state.selectedSession1}
                                    onChange={this.onChangeSession1}
                                    required
                            >
                                <option selected style={{fontSize: '15px'}} value="">Choose Session...</option>
                                {this.state.secondsessions.map((tok,id) => {
                                    return (
                                        <option value={tok.GeneratedSession} id={tok.GeneratedSessionID}>
                                            {tok.GeneratedSession}
                                        </option>
                                    )
                                })}
                            </select>

                            {/*</form>*/}

                        </div>


                        <br/>
                        <div className="form-group mx-sm-3 mb-2 text-center">
                            <button type="submit" className="btn my-1" >
                                Allocate Sessions
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

}
export default OverlapSessions
