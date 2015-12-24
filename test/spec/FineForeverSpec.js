describe('fineForever', function() {
  var infinite;

  beforeEach(function() {
    infinite = new fineForever({}, function(){});
    console.log('infinite');
  });

  afterEach(function() {
    infinite = null;
  });

  describe('initialization', function () {
    it('should be defined', function () {
      expect(fineForever).toBeDefined();
    });

    it('should have public functions', function () {
      expect(infinite.init).toEqual(jasmine.any(Function));
      expect(infinite.setNav).toEqual(jasmine.any(Function));
      expect(infinite.retrieveItems).toEqual(jasmine.any(Function));
      expect(infinite.destroy).toEqual(jasmine.any(Function));
    });

  });


});
