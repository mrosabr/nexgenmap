//------------------------------------------------------------------
// Script classificacao artigo RF
//------------------------------------------------------------------


var gridNames = [
	    ['SB-21-Y-C', 'rf-2_SF3'], //Apui
	    ['SA-23-Y-C', 'rf-2_SF3'], //Paragominas
	    ['SH-21-Z-B', 'rf-2_SF3'], //São Gabriel
	    ['SC-21-Z-C', 'rf-3_SF'], //Sinop 
	    ['SD-23-Y-C', 'rf-3_SF3'], //Brasília 
	    ['SF-23-Y-C', 'rf-2_SF3'], //São Paulo
	    ['SF-23-X-B', 'rf-2_SF3'], //Rio Doce
	    ['SH-22-Y-D', 'rf-2_SF3'], //Pelotas 
	    ['SF-23-Z-B', 'rf-3_SF'], //Rio de Janeio 
	    ['SD-22-Z-C', 'rf-2_SF3'], //Rio Vermelho
	    ['SB-24-Z-D', 'rf-2_SF3'], //Caatinga 2
	    ['SC-24-V-D', 'rf-2_SF3'], //Caatinga 1 
	    ['SE-21-Z-A', 'rf-2_SF3'], //Pantanal 
];

var sampleType = 'validation';

var dirAsset = 'projects/nexgenmap/SAMPLES/production-artigoRF';
var assetClassif = 'projects/nexgenmap/CLASSIFICATION/production_RF3';
var subGridsAsset = 'projects/nexgenmap/ANCILLARY/nextgenmap_subgrids';
var mosaicsAsset = 'projects/nexgenmap/MOSAIC/production-1';
var gridsAsset = 'projects/nexgenmap/ANCILLARY/nextgenmap_grids';
var subGridsFc = ee.FeatureCollection(subGridsAsset);
var assetCollec3_BR = 'projects/mapbiomas-workspace/public/collection4/mapbiomas_collection40_integration_v1';

var classesIn = [
    2, 3, 4, 5,
    9, 10, 11, 12, 13,
    15, 18, 19, 20, 21, 22,
    23, 24, 29, 30, 26, 33
];

//legenda saida
var classesOut = [
    3, 3, 4, 5,
    9, 12, 11, 12, 13,
    15, 18, 18, 18, 15, 22,
    23, 24, 29, 30, 26, 26
];


var classes2 =    [3,        4,         5,          9,                 11,         12,           15,        18,             24,       26,      29      ];
var classNames = ['Forest', 'Savanna', 'Mangrove', 'Planted Forest',  'Wetlands', 'Grassland',  'Pasture', 'Agriculture',  'Urban',  'Water', 'Rocks' ];


// Create Symbol palets
var palettes = require('users/mapbiomas/modules:Palettes.js');


var visClassif = {
    min: 0,
    max: 34,
    palette: palettes.get('classification2'),
    format: 'png'
};

var accList = ee.List([]);

var FCcolPtVali = ee.FeatureCollection([])

gridNames.forEach(
  function (gridName) {
    var FCcolPt = ee.FeatureCollection(dirAsset+'/'+gridName[0]+'-samples_acuracy_balanced')
    FCcolPtVali = FCcolPtVali.merge(FCcolPt.filterMetadata('type', 'equals', 'validation'))

   }
);

var grids = ee.FeatureCollection(gridsAsset)
var Annual2 = ee.ImageCollection(assetClassif).mosaic().clip(grids)

  Annual2 = Annual2.remap(classesIn,classesOut)
  var sampled_pointsan = Annual2.sampleRegions({
        collection: FCcolPtVali,
        properties: ['class'],
        scale: 4
      });
  var errorMatrix_abs = sampled_pointsan.errorMatrix('class', 'remapped', classes2);

  print(errorMatrix_abs.consumersAccuracy())
  print(errorMatrix_abs.producersAccuracy())

