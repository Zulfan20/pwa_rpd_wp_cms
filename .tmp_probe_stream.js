(async ()=>{
  try{
    const r = await fetch('http://localhost:3001/api/stream');
    console.log('STATUS', r.status);
    console.log('CONTENT-TYPE', r.headers.get('content-type'));
    if (r.body && r.body.cancel) r.body.cancel();
  }catch(e){
    console.error('ERROR', e && e.message ? e.message : e);
  }
})();