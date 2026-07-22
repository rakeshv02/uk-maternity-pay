const { useState } = React;

const SMP_FLAT_RATE = 184.03;
const fmt = n => "£" + n.toFixed(2);
const fmtK = n => "£" + Math.round(n).toLocaleString();
const fmtDate = d => new Date(d).toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" });
function addWeeks(date, weeks) { const d=new Date(date); d.setDate(d.getDate()+weeks*7); return d; }

export default function UKMaternityPay() {
  const [weeklyPay,setWeeklyPay]=useState("600");
  const [startDate,setStartDate]=useState("2024-09-01");
  const [additionalOcc,setAdditionalOcc]=useState("0");
  const [leaveWeeks,setLeaveWeeks]=useState("52");
  const [result,setResult]=useState(null);

  const calculate = () => {
    const awe=parseFloat(weeklyPay)||0, addOcc=parseFloat(additionalOcc)||0;
    const start=new Date(startDate), totalWeeks=parseInt(leaveWeeks)||52;
    const higher6=awe*0.90, flat33=Math.min(SMP_FLAT_RATE,awe*0.90);
    const smpHigher=higher6*6, smpFlat=flat33*33;
    const totalSMP=smpHigher+smpFlat, totalOcc=addOcc*totalWeeks, grandTotal=totalSMP+totalOcc;
    const endSMP=addWeeks(start,39), returnDate=addWeeks(start,totalWeeks);
    const weeks=[];
    for (let w=1;w<=totalWeeks;w++) {
      const weekStart=addWeeks(start,w-1), smp=w<=6?higher6:w<=39?flat33:0;
      weeks.push({w,weekStart,smp,occ:addOcc,total:smp+addOcc});
    }
    setResult({awe,higher6,flat33,smpHigher,smpFlat,totalSMP,totalOcc,grandTotal,endSMP,returnDate,weeks,totalWeeks,addOcc});
  };

  const inputStyle={width:"100%",padding:"12px",border:"2px solid #f9a8d4",borderRadius:10,fontSize:16,boxSizing:"border-box",outline:"none"};
  const labelStyle={display:"block",fontWeight:600,marginBottom:6,color:"#333"};

  return (
    <div style={{fontFamily:"'Segoe UI',Arial,sans-serif",background:"#fdf2f8",minHeight:"100vh",padding:"20px"}}>
      <div style={{maxWidth:820,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:48,marginBottom:8}}>🤱</div>
          <h1 style={{margin:0,fontSize:32,fontWeight:800,color:"#1a1a2e"}}>UK Maternity Pay Calculator</h1>
          <p style={{margin:"8px 0 0",color:"#555",fontSize:16}}>Statutory Maternity Pay (SMP) — 2024/25 rates</p>
        </div>

        <div style={{background:"#fff",borderRadius:16,padding:28,boxShadow:"0 4px 24px rgba(0,0,0,0.08)",marginBottom:24}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px,1fr))",gap:20}}>
            <div>
              <label style={labelStyle}>Average Weekly Earnings (AWE)</label>
              <div style={{position:"relative"}}><span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#666",fontWeight:700}}>£</span><input type="number" value={weeklyPay} onChange={e=>setWeeklyPay(e.target.value)} style={{...inputStyle,paddingLeft:28}} /></div>
              <div style={{fontSize:12,color:"#888",marginTop:4}}>Average of last 8 weeks gross pay</div>
            </div>
            <div><label style={labelStyle}>Maternity Leave Start Date</label><input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} style={inputStyle} /></div>
            <div>
              <label style={labelStyle}>Occupational/Enhanced Pay (weekly)</label>
              <div style={{position:"relative"}}><span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#666",fontWeight:700}}>£</span><input type="number" value={additionalOcc} onChange={e=>setAdditionalOcc(e.target.value)} style={{...inputStyle,paddingLeft:28}} /></div>
              <div style={{fontSize:12,color:"#888",marginTop:4}}>Extra from employer on top of SMP (0 if SMP only)</div>
            </div>
            <div><label style={labelStyle}>Total Leave Duration</label>
              <select value={leaveWeeks} onChange={e=>setLeaveWeeks(e.target.value)} style={inputStyle}>
                <option value="26">26 weeks (ordinary maternity leave)</option>
                <option value="39">39 weeks (paid SMP period)</option>
                <option value="52">52 weeks (full maternity leave)</option>
              </select></div>
          </div>
          <button onClick={calculate} style={{width:"100%",marginTop:24,padding:"16px",background:"linear-gradient(135deg, #db2777, #be185d)",color:"#fff",border:"none",borderRadius:12,fontSize:18,fontWeight:700,cursor:"pointer"}}>Calculate Maternity Pay</button>
        </div>

        {result && <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(160px,1fr))",gap:16,marginBottom:24}}>
            {[
              {label:"Total SMP (39 weeks)",value:fmtK(result.totalSMP),color:"#db2777",bg:"#fdf2f8"},
              {label:"Total Maternity Income",value:fmtK(result.grandTotal),color:"#7c3aed",bg:"#faf5ff"},
              {label:"Weeks 1–6 (weekly)",value:fmt(result.higher6),color:"#059669",bg:"#f0fdf4"},
              {label:"Weeks 7–39 (weekly)",value:fmt(result.flat33),color:"#d97706",bg:"#fffbeb"},
              {label:"Return to Work",value:fmtDate(result.returnDate),color:"#0369a1",bg:"#f0f9ff"},
            ].map((item,i)=>(
              <div key={i} style={{background:item.bg,borderRadius:14,padding:18,textAlign:"center",border:`2px solid ${item.color}22`}}>
                <div style={{fontSize:17,fontWeight:800,color:item.color,lineHeight:1.3}}>{item.value}</div>
                <div style={{fontSize:12,color:"#555",marginTop:4,fontWeight:500}}>{item.label}</div>
              </div>
            ))}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:24}}>
            <div style={{background:"#fff",borderRadius:16,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <h3 style={{margin:"0 0 14px",fontSize:16,fontWeight:700,color:"#1a1a2e"}}>Pay Summary</h3>
              {[
                {label:"Avg Weekly Earnings",value:fmt(result.awe)},
                {label:"Wks 1–6 (90% AWE)",value:`${fmt(result.higher6)}/wk`,color:"#059669"},
                {label:"Wks 7–39 (flat rate)",value:`${fmt(result.flat33)}/wk`,color:"#d97706"},
                {label:"SMP Weeks 1–6",value:fmtK(result.smpHigher),color:"#db2777"},
                {label:"SMP Weeks 7–39",value:fmtK(result.smpFlat),color:"#db2777"},
                {label:"Total SMP",value:fmtK(result.totalSMP),bold:true,color:"#db2777"},
                {label:"Total Maternity Income",value:fmtK(result.grandTotal),bold:true,color:"#7c3aed",border:true},
              ].map((row,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderTop:row.border?"2px solid #e9ecef":"1px solid #f1f3f5"}}>
                  <span style={{fontSize:14,color:"#444",fontWeight:row.bold?700:400}}>{row.label}</span>
                  <span style={{fontSize:14,fontWeight:row.bold?700:600,color:row.color||"#222"}}>{row.value}</span>
                </div>
              ))}
            </div>
            <div style={{background:"#fff",borderRadius:16,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <h3 style={{margin:"0 0 14px",fontSize:16,fontWeight:700,color:"#1a1a2e"}}>Key Dates</h3>
              {[
                {label:"Leave Starts",value:fmtDate(new Date(startDate))},
                {label:"SMP Ends (week 39)",value:fmtDate(result.endSMP)},
                {label:"Full Leave Ends",value:fmtDate(result.returnDate)},
                {label:"Total Leave",value:`${result.totalWeeks} weeks`},
              ].map((row,i)=>(
                <div key={i} style={{padding:"11px 0",borderBottom:"1px solid #f1f3f5"}}>
                  <div style={{fontSize:13,color:"#888"}}>{row.label}</div>
                  <div style={{fontSize:15,fontWeight:700,color:"#1a1a2e",marginTop:2}}>{row.value}</div>
                </div>
              ))}
              <div style={{marginTop:16,padding:14,background:"#fdf2f8",borderRadius:10}}>
                <div style={{fontSize:13,fontWeight:600,color:"#db2777",marginBottom:6}}>SMP Eligibility</div>
                {["Employed 26+ weeks before qualifying week","Earning ≥£123/week (LEL)","Proper notice given to employer"].map((item,i)=>(
                  <div key={i} style={{fontSize:12,color:"#555",marginBottom:3}}>✅ {item}</div>
                ))}
              </div>
            </div>
          </div>

          <div style={{background:"#fff",borderRadius:16,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,0.06)",marginBottom:24}}>
            <h3 style={{margin:"0 0 14px",fontSize:16,fontWeight:700,color:"#1a1a2e"}}>Weekly Breakdown (first 15 weeks)</h3>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                <thead><tr style={{background:"#fdf2f8"}}>{["Week","Date","SMP","Occupational","Total"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontWeight:700}}>{h}</th>)}</tr></thead>
                <tbody>{result.weeks.slice(0,15).map((w,i)=>(
                  <tr key={i} style={{borderBottom:"1px solid #f1f3f5",background:i<6?"#fff9fb":i<39?"#fff":"#f9fafb"}}>
                    <td style={{padding:"8px 12px",fontWeight:600,color:i<6?"#db2777":i<39?"#d97706":"#9ca3af"}}>{w.w}</td>
                    <td style={{padding:"8px 12px"}}>{fmtDate(w.weekStart)}</td>
                    <td style={{padding:"8px 12px"}}>{w.smp>0?fmt(w.smp):"—"}</td>
                    <td style={{padding:"8px 12px"}}>{w.occ>0?fmt(w.occ):"—"}</td>
                    <td style={{padding:"8px 12px",fontWeight:700}}>{fmt(w.total)}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        </>}
      </div>
    </div>
  );
}
