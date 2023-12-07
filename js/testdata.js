function createTestData() {
  var result = {};
  
  function makeVoxels(l, h, f) {
    var d = [ h[0]-l[0], h[1]-l[1], h[2]-l[2] ]
      , v = new Int32Array(d[0]*d[1]*d[2])
      , n = 0;
    for(var k=l[2]; k<h[2]; ++k)
    for(var j=l[1]; j<h[1]; ++j)
    for(var i=l[0]; i<h[0]; ++i, ++n) {
      v[n] = f(i,j,k);
    }
    return {voxels:v, dims:d};
  }
  
  var colorTab = [
    0xff0000,
    0x00ff00,
    0x0000ff,
    0xff00ff,
    0xffff00,
    0x00ffff,
    0x000001,
    0xffffff
  ];
  
  for(var i=1,c=0; i<=16; i<<=1,++c) {
    result[i + 'x' + i + 'x' + i] = makeVoxels([0,0,0], [i,i,i], function() { return colorTab[c]; });
  }
  
  result['Sphere'] = makeVoxels([-16,-16,-16], [16,16,16], function(i,j,k) {
    return i*i+j*j+k*k <= 16*16 ? 0x113344 : 0;
  });

  result['Noise'] = makeVoxels([0,0,0], [16,16,16], function(i,j,k) {
    return Math.random() < 0.1 ? Math.random() * 0xffffff : 0;
  });

  result['Dense Noise'] = makeVoxels([0,0,0], [16,16,16], function(i,j,k) {
    return Math.round(Math.random() * 0xffffff);
  });

  result['16 Color Noise'] = makeVoxels([0,0,0], [16,16,16], function(i,j,k) {
    return Math.random() < 0.1 ? colorTab[Math.floor(Math.random() * colorTab.length)] : 0;
  });

  result['Hole'] = makeVoxels([0,0,0], [16,16,1], function(i,j,k) {
    return Math.abs(i-7) > 3 || Math.abs(j-7) > 3 ? 1 : 0;
  });
  
  result['HollowCube'] = makeVoxels([0,0,0], [16,16,16], function(i,j,k) {
    if(i < 1) {
      return 0xff0000;
    } else if(i >= 15) {
      return 0x00ffff;
    } else if(j < 1) {
      return 0x00ff00;
    } else if(j >= 15) {
      return 0xff00ff;
    } else if(k < 1) {
      return 0x0000ff;
    } else if(k >= 15) {
      return 0xffff00;
    } else {
      return 0;
    }
  });
  
  result['Triangle'] = makeVoxels([0,0,0], [17,17,1], function(i,j,k) {
    return (i < j) ? 0xff00ff : 0;
  });
  
  result['4Dots']  = makeVoxels([0,0,0], [7,7,1], function(i,j,k) {
    if( (i == 2 && j == 1) ||
        (i == 5 && j == 2) ||
        (i == 1 && j == 4) ||
        (i == 4 && j == 5) ) {
      return 0x00ff;    
    }
    return 0xeedd00;
  });
  
  result["Matt's Example"]  = makeVoxels([0,0,0], [4,5,1], function(i,j,k) {
    if( (i == 1 && j == 1) ||
        (i == 2 && j == 3) ) {
      return 0xee5533;
    }
    return 0x128844;
  });
  
  result['Benchmark (SLOW!)'] = makeVoxels([-32, -32, -32], [37, 37, 37], function(x, y, z) {
    var s = 2.0 * Math.PI / 37.0;
    return Math.sin(s * x) + Math.sin(s * y) + Math.sin(s * z) < 0 ? 1 : 0;
  });
  
  result['Hill'] = makeVoxels([-16, 0, -16], [16,16,16], function(i,j,k) {
    return j <= 16 * Math.exp(-(i*i + k*k) / 64) ? 0x118822 : 0;
  });
  
  result['Valley'] = makeVoxels([0,0,0], [32,32,32], function(i,j,k) {
    return j <= (i*i + k*k) * 31 / (32*32*2) + 1 ? 0x118822 : 0;
  });
  
  result['Hilly Terrain'] = makeVoxels([0, 0, 0], [32,32,32], function(i,j,k) {
    var h0 = 3.0 * Math.sin(Math.PI * i / 12.0 - Math.PI * k * 0.1) + 27;    
    if(j > h0+1) {
      return 0;
    }
    if(h0 <= j) {
      return 0x23dd31;
    }
    var h1 = 2.0 * Math.sin(Math.PI * i * 0.25 - Math.PI * k * 0.3) + 20;
    if(h1 <= j) {
      return 0x964B00;
    }
    if(2 < j) {
      return Math.random() < 0.1 ? 0x222222 : 0xaaaaaa;
    }
    return 0xff0000;
  });
  
  result['Empty'] = { voxels : [], dims : [0,0,0] };

  return result;
}
