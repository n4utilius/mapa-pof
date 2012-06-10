
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Gastos de Publicidad Oficial por Estado' })
};