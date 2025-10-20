const API_BASE = '/api' 

export async function fetchJSON(path, opts = {}){
  const res = await fetch(API_BASE + path, {...opts, headers: { 'Content-Type':'application/json', ...(opts.headers||{}) } })
  if (!res.ok) throw new Error('Network response was not ok: ' + res.status)
  return res.json()
}
export default { fetchJSON }
