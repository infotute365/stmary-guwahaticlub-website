import test from 'node:test'
import assert from 'node:assert/strict'
import axios from 'axios'

test('disclosure service keeps the public array contract, traverses pages, and sends optimistic update/delete versions',async()=>{
  const previous=axios.defaults.adapter,requests=[]
  let cyclic=false
  axios.defaults.adapter=async config=>{
    requests.push(config)
    if(config.url==='/auth/session')return {status:200,config,headers:{},data:{role:'admin'}}
    if(config.method==='get')return {status:200,config,headers:{},data:{disclosures:[{title:config.params.before?'second':'first'}],nextBefore:cyclic?'abc':config.params.before?null:'abc'}}
    return {status:200,config,headers:{},data:{fixture:true}}
  }
  try{
    const api=await import('../src/services/api.js?disclosure-service-test')
    assert.deepEqual(await api.getDisclosures(),[{title:'first'},{title:'second'}])
    assert.equal(requests.filter(config=>config.url==='/auth/session').length,0,'Public document loading must not add private session checks')
    await api.getDisclosures(true)
    await api.updateDisclosure('fixture-id',{expectedVersion:3,title:'Fixture'})
    await api.deleteDisclosure('fixture-id',4)
    assert.deepEqual(JSON.parse(requests.at(-1).data),{expectedVersion:4})
    assert.deepEqual(JSON.parse(requests.at(-2).data),{expectedVersion:3,title:'Fixture'})
    for(const name of ['getDisclosures','createDisclosure','updateDisclosure','deleteDisclosure'])assert.equal(api.default[name],api[name])
    cyclic=true
    await assert.rejects(api.getDisclosures(),/cursor/)
  }finally{axios.defaults.adapter=previous}
})
