import AV from './AV'

const Area = AV.Object.extend('Area')

export async function get_area(point) {
  const query = new AV.Query('Area')
  const areas = await query.equalTo('active', true).find()
  const a = areas.find(a => a.get('center').kilometersTo(point) < a.get('radius'))

  if(!a) throw new Error('抱歉，您所在区域不在本游戏范围内...');
  return {
    id: a.id,
    name: a.get('name')
  }
}
