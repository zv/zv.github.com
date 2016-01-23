/*global THREE */

var container;
var camera, scene, renderer;
var plane, cube;
var mouse, raycaster, isShiftDown = false;

// A global sgrid object;
var sgrid;

var rollOverMesh, rollOverMaterial;
var cubeGeo, cubeMaterial;

var objects = [];


init();
render();

function init() {
  container = document.createElement( 'div' );
  document.body.appendChild( container );

  var info = document.createElement( 'div' );
  info.style.position = 'absolute';
  info.style.top = '10px';
  info.style.width = '100%';
  info.style.textAlign = 'center';
  container.appendChild( info );

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.set( 500, 800, 1300 );
  camera.lookAt( new THREE.Vector3() );

  scene = new THREE.Scene();

  sgrid = new SceneGrid({size: 500, step: 50})

  sgrid.draw_grid(0, 0);

  // roll-over helpers
  var rollOverGeo = sgrid.scaled_box();
  rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, transparent: true } );
  rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
  scene.add( rollOverMesh );

  // cubes
  cubeGeo = sgrid.scaled_box();
  cubeMaterial = new THREE.MeshLambertMaterial( { // wireframe: true,
    wireframeLinewidth: 1,
    depthWrite: true,
    color: 'white',
    shading: THREE.atShading } );

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  var ambientLight = new THREE.AmbientLight( 0x606060 );
  scene.add( ambientLight );

  var directionalLight = new THREE.DirectionalLight( 0xffffff );
  directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
  scene.add( directionalLight );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setClearColor( 0xf0f0f0 );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  document.addEventListener( 'keydown', onDocumentKeyDown, false );
  document.addEventListener( 'keyup', onDocumentKeyUp, false );

  //

  window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

  event.preventDefault();

  mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

  raycaster.setFromCamera( mouse, camera );

  var intersects = raycaster.intersectObjects( objects );
  if ( intersects.length > 0 ) {
    sgrid.cube_intersect(intersects[0]);
  }

  render();
}

function onDocumentMouseDown( event ) {
  event.preventDefault();
  mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

  raycaster.setFromCamera( mouse, camera );

  var intersects = raycaster.intersectObjects( objects );

  if ( intersects.length > 0 ) {
    var intersect = intersects[ 0 ];
    // delete cube
    if ( isShiftDown ) {
      if ( intersect.object != plane ) {
        sgrid.remove_cube(intersect);
        scene.remove( intersect.object );
        objects.splice( objects.indexOf( intersect.object ), 1 );
      }
      // create cube
    } else {
      var voxel = sgrid.place_cube(intersect);
      scene.add( voxel );
      objects.push( voxel );
    }

    render();
  }
}

function onDocumentKeyDown( event ) {

  switch( event.keyCode ) {

  case 16: isShiftDown = true; break;
  }
}

function onDocumentKeyUp( event ) {

  switch ( event.keyCode ) {
  case 16: isShiftDown = false; break;
  }
}

function render() {
  renderer.render( scene, camera );
}


/*
 * Operating Grid Class
 */

function SceneGrid(args) {
  // Setup our size and "stepping" (distance between lines) of grid
  this.size = args.size;
  this.step = args.step;

  this.grid_geometry = new THREE.PlaneBufferGeometry( this.size * 2, this.size * 2);
  this.grid_geometry.rotateX( - Math.PI / 2 );

  plane = new THREE.Mesh( this.grid_geometry,
                          new THREE.MeshBasicMaterial( { visible: false } ) );

  scene.add( plane );
  objects.push( plane );

  this.image = (this.size / this.step ) * 2;
  this.open_map = new Array(this.image);
  // This is so stupid now that we have fill, but I don't want to use babel.
  for(var i = 0; i < this.image; i++) {
    this.open_map[i] = new Array(this.image);
    for(var j = 0; j < this.image; j++) {
      this.open_map[i][j] = 0;
    }
  }

  // A function to actually place the grid
  this.draw_grid = function(length) {
    if (length > this.size) {
      return;
    }

    var line_geometry = new THREE.Geometry();

    // Draw our lines
    var that = this;
    setTimeout(function() {
      for ( var i = - length; i <= length; i += that.step ) {
        line_geometry.vertices.push( new THREE.Vector3( - length, 0, i ) );
        line_geometry.vertices.push( new THREE.Vector3(   length, 0, i ) );
        line_geometry.vertices.push( new THREE.Vector3( i, 0, - length ) );
        line_geometry.vertices.push( new THREE.Vector3( i, 0,   length ) );
      }

      // Set the material our lines will look like
      var material = new THREE.LineBasicMaterial({
        color: 0x000000,
        opacity: 0.2,
        transparent: true
      });

      if (that.scene_line) {  scene.remove(that.scene_line); }
      that.scene_line = new THREE.LineSegments( line_geometry, material );
      scene.add(that.scene_line);

      render();

      that.draw_grid(length + that.step);
    }, 50)
  }

  this.cube_intersect = function(intersect) {
    var stepping = this.step ;
    var half_step = Math.floor(stepping / 2)
    rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
    rollOverMesh.position.divideScalar( stepping )
      .floor()
      .multiplyScalar( stepping )
      .addScalar(half_step);
  }

  this.place_cube = function(intersect) {
    var stepping = this.step ;
    var half_step = Math.floor(stepping / 2);
    var voxel = new THREE.Mesh( cubeGeo, cubeMaterial );
    voxel.position.copy( intersect.point ).add( intersect.face.normal );
    voxel.position.divideScalar( stepping )
      .floor()
      .multiplyScalar( stepping )
      .addScalar( half_step );

    var plane_size = Math.floor(this.size / 2)

    var x = Math.floor((voxel.position.x + this.size) / stepping);
    var y = Math.floor((voxel.position.z + this.size) / stepping);

    this.open_map[x][y] = 1;

    return voxel;
  }

  this.remove_cube = function(intersect) {
    var stepping = this.step ;
    var half_step = Math.floor(stepping / 2);
    var voxel = new THREE.Mesh( cubeGeo, cubeMaterial );
    voxel.position.copy( intersect.point ).add( intersect.face.normal );
    voxel.position.divideScalar( stepping )
      .floor()
      .multiplyScalar( stepping )
      .addScalar( half_step );

    var plane_size = Math.floor(this.size / 2)

    var x = Math.floor((voxel.position.x + this.size) / stepping);
    var y = Math.floor((voxel.position.z + this.size) / stepping);

    this.open_map[x][y] = 0;
  }

  this.scaled_box = function() {
    return new THREE.BoxGeometry( this.step, this.step, this.step );
  }
}

