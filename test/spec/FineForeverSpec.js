describe('fineForever', function() {
  var infinite;

  beforeEach(function() {
    var body = document.querySelector('body');
    body.innerHTML = '<div class="pagination"><a href="#">Page 2</a></div>';

    // TODO - look into jasmine-fixtures to use DOM elements in the support/*.html files
    infinite = new fineForever({}, function(){});
  });

  afterEach(function() {
    var body = document.querySelector('body');
    body.innerHTML = '';
    infinite = null;
  });

  describe('initialization', function () {

    it('should be defined', function () {
      expect(fineForever).toBeDefined();
    });

    it('should have public functions', function () {
      expect(infinite.setNav).toEqual(jasmine.any(Function));
      expect(infinite.retrieveItems).toEqual(jasmine.any(Function));
      expect(infinite.destroy).toEqual(jasmine.any(Function));
    });

  });


});
