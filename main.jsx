
import React, {useEffect, useMemo, useState} from "react";
import {createRoot} from "react-dom/client";
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import {Activity, BarChart3, CalendarDays, ChevronDown, Download, FileSpreadsheet, Filter, Gauge, Moon, Sun, Trophy, Upload, Users, Zap} from "lucide-react";
import "./styles.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
const fallback = {
  match:{title:"West Indies vs Sri Lanka — 1st Test", venue:"Sir Vivian Richards Stadium, North Sound Antigua", dates:"25–28 June 2026", result:"West Indies won by an innings and 217 runs", series:"West Indies lead 1–0"},
  innings:[
    {number:1,team:"Sri Lanka",score:308,wickets:10,overs:71.5},
    {number:2,team:"West Indies",score:626,wickets:9,overs:160.5},
    {number:3,team:"Sri Lanka",score:101,wickets:10,overs:31.2}
  ],
  sessions:[
    {day:1,session:1,runs:109,wickets:3,overs:"24.1"},{day:1,session:2,runs:95,wickets:2,overs:"24.2"},{day:1,session:3,runs:104,wickets:5,overs:"24.2"},
    {day:2,session:1,runs:103,wickets:3,overs:"28.3"},{day:2,session:2,runs:71,wickets:2,overs:"28.0"},{day:2,session:3,runs:97,wickets:0,overs:"28.3"},
    {day:3,session:1,runs:15,wickets:1,overs:"4.2"},{day:3,session:2,runs:82,wickets:0,overs:"24.1"},{day:3,session:3,runs:273,wickets:4,overs:"53.1"},
    {day:4,session:1,runs:30,wickets:2,overs:"10.2"},{day:4,session:2,runs:30,wickets:3,overs:"9.0"},{day:4,session:3,runs:26,wickets:4,overs:"8.3"}
  ],
  batting:[
    {innings:1,team:"Sri Lanka",player:"DM de Silva",runs:120,balls:168,fours:17,sixes:0,sr:71.4},
    {innings:1,team:"Sri Lanka",player:"LD Chandimal",runs:54,balls:67,fours:8,sixes:0,sr:80.6},
    {innings:1,team:"Sri Lanka",player:"GS Dinusha",runs:43,balls:75,fours:6,sixes:0,sr:56.6},
    {innings:2,team:"West Indies",player:"AA Jangoo",runs:233,balls:373,fours:19,sixes:3,sr:62},
    {innings:2,team:"West Indies",player:"RL Chase",runs:194,balls:324,fours:13,sixes:2,sr:59.5},
    {innings:2,team:"West Indies",player:"JD Campbell",runs:39,balls:64,fours:3,sixes:2,sr:60.9},
    {innings:2,team:"West Indies",player:"BA King",runs:31,balls:52,fours:4,sixes:0,sr:59.6},
    {innings:3,team:"Sri Lanka",player:"LD Chandimal",runs:43,balls:60,fours:5,sixes:0,sr:71.7}
  ],
  bowling:[
    {innings:1,team:"West Indies",player:"JP Greaves",overs:11,runs:39,wickets:3,economy:3.49,dot_pct:74.2},
    {innings:1,team:"West Indies",player:"KAJ Roach",overs:12,runs:32,wickets:2,economy:2.67,dot_pct:73.6},
    {innings:2,team:"Sri Lanka",player:"RMMP Rathnayake",overs:35.5,runs:124,wickets:5,economy:3.46,dot_pct:72.6},
    {innings:2,team:"Sri Lanka",player:"AM Fernando",overs:28,runs:56,wickets:2,economy:2,dot_pct:76.8},
    {innings:3,team:"West Indies",player:"KAJ Roach",overs:11,runs:51,wickets:4,economy:4.64,dot_pct:72.7},
    {innings:3,team:"West Indies",player:"JNT Seales",overs:10.2,runs:14,wickets:3,economy:1.35,dot_pct:90.3},
    {innings:3,team:"West Indies",player:"S Joseph",overs:5,runs:19,wickets:2,economy:3.8,dot_pct:70},
    {innings:3,team:"West Indies",player:"AS Joseph",overs:5,runs:11,wickets:1,economy:2.2,dot_pct:83.3}
  ],
  partnerships:[{pair:"AA Jangoo / RL Chase",runs:401,balls:603,key:true},{pair:"DM de Silva / GS Dinusha",runs:99,balls:150},{pair:"BA King / JD Campbell",runs:58,balls:81}],
  ratings:[
    {team:"Sri Lanka",metric:"Batting",rating:4},{team:"Sri Lanka",metric:"Bowling",rating:5},{team:"Sri Lanka",metric:"Field/Control",rating:4},
    {team:"West Indies",metric:"Batting",rating:9.5},{team:"West Indies",metric:"Bowling",rating:9},{team:"West Indies",metric:"Control",rating:9}
  ]
};

function App(){
  const [data,setData]=useState(fallback), [day,setDay]=useState("All"), [innings,setInnings]=useState("All");
  const [team,setTeam]=useState("All"), [dark,setDark]=useState(true), [tab,setTab]=useState("Overview"), [query,setQuery]=useState("");
  const [uploadMsg,setUploadMsg]=useState("");
  useEffect(()=>{ fetch(API+"/api/match").then(r=>r.json()).then(setData).catch(()=>{}); },[]);

  const sessions=useMemo(()=>data.sessions.filter(x=>(day==="All"||String(x.day)===day)),[data,day]);
  const batting=useMemo(()=>data.batting.filter(x=>(innings==="All"||String(x.innings)===innings)&&(team==="All"||x.team===team)&&x.player.toLowerCase().includes(query.toLowerCase())),[data,innings,team,query]);
  const bowling=useMemo(()=>data.bowling.filter(x=>(innings==="All"||String(x.innings)===innings)&&(team==="All"||x.team===team)&&x.player.toLowerCase().includes(query.toLowerCase())),[data,innings,team,query]);

  const exportFile=(type)=>window.open(`${API}/api/export/${type}`,"_blank");
  const upload=async e=>{
    const file=e.target.files[0]; if(!file) return;
    const fd=new FormData(); fd.append("file",file);
    try { const r=await fetch(API+"/api/upload/excel",{method:"POST",body:fd}); const j=await r.json(); setUploadMsg(`${j.filename}: ${j.rows} rows accepted.`); }
    catch(err){ setUploadMsg("Upload failed. Check the API server."); }
  };

  const topBat=batting.slice().sort((a,b)=>b.runs-a.runs).slice(0,8);
  const sessionChart=sessions.map((s,i)=>({...s,label:`D${s.day} S${s.session}`,idx:i+1}));
  const ratingData=["Batting","Bowling","Control"].map(metric=>({
    metric, "West Indies":data.ratings.find(x=>x.team==="West Indies"&&x.metric===metric)?.rating||0,
    "Sri Lanka":data.ratings.find(x=>x.team==="Sri Lanka"&&x.metric===metric)?.rating||0
  }));

  return <div className={dark?"app dark":"app"}>
    <aside className="sidebar">
      <div className="brand"><div className="brandMark">CA</div><div><b>Cricket Analytics</b><span>Performance Intelligence</span></div></div>
      <nav>{["Overview","Sessions","Batting","Bowling","Partnerships","Wickets","Team Compare","Upload"].map(x=><button className={tab===x?"nav active":"nav"} onClick={()=>setTab(x)} key={x}><span>{x}</span></button>)}</nav>
      <div className="sideBottom"><button className="nav" onClick={()=>setDark(!dark)}>{dark?<Sun size={17}/>:<Moon size={17}/>}<span>{dark?"Light mode":"Dark mode"}</span></button></div>
    </aside>

    <main className="main">
      <header className="topbar">
        <div><div className="eyebrow">TEST MATCH • PERFORMANCE CENTRE</div><h1>{data.match.title}</h1><p>{data.match.venue} · {data.match.dates}</p></div>
        <div className="actions"><button onClick={()=>exportFile("pdf")}><Download size={16}/> PDF</button><button onClick={()=>exportFile("pptx")}><Download size={16}/> PPTX</button></div>
      </header>

      <section className="filters">
        <Filter size={17}/><select value={day} onChange={e=>setDay(e.target.value)}><option>All</option><option value="1">Day 1</option><option value="2">Day 2</option><option value="3">Day 3</option><option value="4">Day 4</option></select>
        <select value={innings} onChange={e=>setInnings(e.target.value)}><option>All</option><option value="1">Innings 1</option><option value="2">Innings 2</option><option value="3">Innings 3</option></select>
        <select value={team} onChange={e=>setTeam(e.target.value)}><option>All</option><option>West Indies</option><option>Sri Lanka</option></select>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search player…"/>
        <span className="filterNote">{day==="All"?"All days":`Day ${day}`} · {innings==="All"?"All innings":`Innings ${innings}`}</span>
      </section>

      <section className="hero">
        <div className="resultCard"><div className="resultLabel">MATCH RESULT</div><strong>{data.match.result}</strong><span>{data.match.series}</span></div>
        {data.innings.map(i=><div className="scoreCard" key={i.number}><span>INNINGS {i.number} · {i.team}</span><b>{i.score}{i.declared?"/9d":`/${i.wickets}`}</b><small>{i.overs} overs</small></div>)}
      </section>

      {tab==="Overview" && <Overview data={data} sessionChart={sessionChart} topBat={topBat} ratingData={ratingData}/>}
      {tab==="Sessions" && <Sessions data={data} sessions={sessions}/>}
      {tab==="Batting" && <Batting rows={batting}/>}
      {tab==="Bowling" && <Bowling rows={bowling}/>}
      {tab==="Partnerships" && <Partnerships data={data}/>}
      {tab==="Wickets" && <Wickets data={data}/>}
      {tab==="Team Compare" && <TeamCompare data={data} ratingData={ratingData}/>}
      {tab==="Upload" && <Upload upload={upload} msg={uploadMsg}/>}
    </main>
  </div>
}

function Card({title,icon,children,wide=false}){return <div className={wide?"card wide":"card"}><div className="cardHead"><div><h3>{title}</h3></div>{icon}</div>{children}</div>}

function Overview({data,sessionChart,topBat,ratingData}){
 return <div className="content">
  <div className="kpis">
   <Kpi icon={<Trophy/>} label="Largest partnership" value="401" sub="Jangoo + Chase"/>
   <Kpi icon={<Zap/>} label="Top score" value="233" sub="Amir Jangoo"/>
   <Kpi icon={<Gauge/>} label="Final margin" value="217" sub="Innings victory"/>
   <Kpi icon={<Activity/>} label="Final innings dot %" value="79.8%" sub="West Indies bowling"/>
  </div>
  <div className="grid2">
   <Card title="Session momentum" icon={<BarChart3 size={18}/>}><ResponsiveContainer width="100%" height={280}><BarChart data={sessionChart}><CartesianGrid strokeDasharray="3 3" opacity=".12"/><XAxis dataKey="label"/><YAxis/><Tooltip/><Legend/><Bar dataKey="runs" name="Runs" radius={[6,6,0,0]}/><Bar dataKey="wickets" name="Wickets" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></Card>
   <Card title="Team performance rating" icon={<Activity size={18}/>}><ResponsiveContainer width="100%" height={280}><RadarChart data={ratingData}><PolarGrid/><PolarAngleAxis dataKey="metric"/><PolarRadiusAxis domain={[0,10]}/><Radar name="West Indies" dataKey="West Indies" fill="var(--accent)" fillOpacity=".45"/><Radar name="Sri Lanka" dataKey="Sri Lanka" fill="var(--accent2)" fillOpacity=".35"/><Legend/></RadarChart></ResponsiveContainer></Card>
  </div>
  <div className="grid2">
   <Card title="Top batting performances" icon={<Users size={18}/>}><ResponsiveContainer width="100%" height={300}><BarChart data={topBat} layout="vertical" margin={{left:20,right:20}}><CartesianGrid strokeDasharray="3 3" opacity=".12"/><XAxis type="number"/><YAxis type="category" dataKey="player" width={100}/><Tooltip/><Bar dataKey="runs" name="Runs" radius={[0,6,6,0]}/></BarChart></ResponsiveContainer></Card>
   <Card title="Match narrative" icon={<Activity size={18}/>}><div className="insights"><div><b>Turning point</b><p>West Indies moved from 168/5 to a 626/9 declaration through the Jangoo–Chase partnership.</p></div><div><b>Bowling impact</b><p>Roach took 4 wickets in the final innings and reached 300 Test wickets; Seales returned 3/14 in the report.</p></div><div><b>Control</b><p>The final West Indies bowling innings recorded a 79.8% dot-ball rate.</p></div></div></Card>
  </div>
 </div>
}

function Sessions({sessions}){return <div className="content"><Card title="Session-by-session control" icon={<CalendarDays size={18}/>}><ResponsiveContainer width="100%" height={420}><LineChart data={sessions.map((x,i)=>({...x,label:`D${x.day} S${x.session}`}))}><CartesianGrid strokeDasharray="3 3" opacity=".12"/><XAxis dataKey="label"/><YAxis/><Tooltip/><Legend/><Line type="monotone" dataKey="runs" stroke="var(--accent)" strokeWidth={3}/><Line type="monotone" dataKey="wickets" stroke="var(--accent2)" strokeWidth={3}/></LineChart></ResponsiveContainer><Table rows={sessions} cols={["day","session","runs","wickets","overs"]}/></Card></div>}

function Batting({rows}){return <div className="content"><Card title="Batting intelligence" icon={<Users size={18}/>}><Table rows={rows} cols={["innings","team","player","runs","balls","fours","sixes","sr"]}/></Card></div>}
function Bowling({rows}){return <div className="content"><Card title="Bowling intelligence" icon={<Activity size={18}/>}><Table rows={rows} cols={["innings","team","player","overs","runs","wickets","economy","dot_pct"]}/></Card></div>}
function Partnerships({data}){return <div className="content"><Card title="Partnership network" icon={<Users size={18}/>}><ResponsiveContainer width="100%" height={380}><BarChart data={data.partnerships}><CartesianGrid strokeDasharray="3 3" opacity=".12"/><XAxis dataKey="pair" angle={-20} textAnchor="end" height={100}/><YAxis/><Tooltip/><Bar dataKey="runs" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer><Table rows={data.partnerships} cols={["pair","runs","balls","key"]}/></Card></div>}
function Wickets({data}){return <div className="content"><Card title="Wicket timeline" icon={<Activity size={18}/>}><div className="timeline">{data.wickets.map((w,i)=><div className="event" key={i}><div className="dot"></div><div><b>Innings {w.innings} · {w.ball}</b><span>{w.player} — {w.type}</span></div></div>)}</div></Card></div>}
function TeamCompare({data,ratingData}){return <div className="content"><Card title="West Indies vs Sri Lanka" icon={<Trophy size={18}/>}><ResponsiveContainer width="100%" height={420}><BarChart data={ratingData}><CartesianGrid strokeDasharray="3 3" opacity=".12"/><XAxis dataKey="metric"/><YAxis domain={[0,10]}/><Tooltip/><Legend/><Bar dataKey="West Indies" radius={[6,6,0,0]}/><Bar dataKey="Sri Lanka" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></Card></div>}
function Upload({upload,msg}){return <div className="content"><Card title="Excel / CSV match ingestion" icon={<FileSpreadsheet size={18}/>}><div className="upload"><Upload size={42}/><h2>Drop your match file</h2><p>Upload Excel/CSV and the FastAPI backend will validate and preview it.</p><label className="uploadBtn">Choose file<input type="file" accept=".xlsx,.xls,.csv" onChange={upload}/></label>{msg&&<div className="success">{msg}</div>}</div></Card></div>}

function Kpi({icon,label,value,sub}){return <div className="kpi"><div className="kpiIcon">{icon}</div><span>{label}</span><b>{value}</b><small>{sub}</small></div>}
function Table({rows,cols}){return <div className="tableWrap"><table><thead><tr>{cols.map(c=><th key={c}>{c.replace("_"," ")}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{cols.map(c=><td key={c}>{String(r[c]??"")}</td>)}</tr>)}</tbody></table></div>}

createRoot(document.getElementById("root")).render(<App/>);
