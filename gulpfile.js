

//css y sass
const {src, dest, watch, series, parallel} = require('gulp')
const sass = require('gulp-sass')(require('sass')) /* lo unico que hcae es compilar archivos */

// pordemos escribir css de ultima generacion ala vez que soporten la mayoria de los navegadores
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemap = require('gulp-sourcemaps'); //crea un archivo con el map de css asi para ubicarnos mejor xd
const cssnano = require('cssnano'); //mimifica nuestro codigo css y lo mejora para que pese menos 

// dependencias de imagenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');
//el sourcemap se usa antes de compilar y despues de guardar 


function css (done) {
        src('src/scss/app.scss') //identificar
                .pipe(sourcemap.init()) //inicia el sourcemap
        .pipe( sass({outputStyle: 'expanded'})) /* compilar : compresed mimifica el archivo css */
                .pipe( postcss([autoprefixer(), cssnano() ])) //aplica algun pricesamineto
                .pipe(sourcemap.write('.')) //grabamos el sourcemap
                .pipe( dest('build/css')) //guardar dest significa destino 
        done(); /* es una funcion que se manda a llamar y gulp save que finalizo esa tarea */
}
//funcion para converitir imagenes
function versionAvif () {
        const opciones = {
                quality: 50
        }
        return src('src/img/**/*.{jpg,png}')
                .pipe( avif( opciones))
                .pipe( dest('build/img'))
}
function versionWebp (){
        const opciones = {
                quality: 50
        }
        return src('src/img/**/*.{jpg,png}')
                .pipe( webp(opciones))
                .pipe( dest('build/img'))
}
function imagenes (){
        return src('src/img/**/*')
        .pipe( imagemin({optimizationLevel: 3}))
        .pipe( dest ('build/img'));
}
// el watch nos sirve para que no tengamos que estar compilando a cada rato
function dev (){
        // recibe dos parametros el primero es para saver que va a escuchar 
        // y el segundo es que hacer cuando el primero tenga cambios
        //tenemos comodines para que escuche todos los cambios e todos los archivos
        watch( 'src/scss/**/*.scss', css);
        // watch('src/scss/app.scss', css);
        watch( 'src/img/**/*', imagenes);

}


exports.css = css;
exports.dev = dev;
// tareas por default
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series(imagenes,versionWebp, versionAvif, css, dev);