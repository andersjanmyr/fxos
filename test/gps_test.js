describe('gps test', function () {
  'use strict';

  it('Position gets latitude and longitude', function (done) {
    Gps.position(function(pos) {
      console.log(pos);
      chai.expect(pos.latitude).to.be.defined;
      chai.expect(pos.longitude).to.be.defined;
      done();
    });
  });
});

