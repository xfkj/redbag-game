import AV from './AV'

export const Student = AV.Object.extend('Student')

export function get_cs(openid) {
  const sts = new AV.Query('Student')
  return sts.equalTo('openid', openid).first()
  .then(s => {
      if (s) return s;
      const new_s = new Student({openid, amount: 0, finished:[]})
      return new_s.save()
    }
  )
}

export function get_question(student) {
  const qs = new AV.Query('Question')
  return qs.notContainedIn('objectId', student.get('finished')).first()
  .then(q => {
    if(!q) throw new Error('您已通关，请期待下次游戏！');
    return q.toJSON()
  })
}

export function answer_right(student, {objectId, prize}) {
  student.addUnique('finished', objectId)
  student.set('amount', student.get('amount') + prize)
  return student.save()
}
