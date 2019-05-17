/*
    Note: acts like services in angular that request back-end APIs
*/

import axios from "axios";

const apiAdapter = require('../../config/apiAdapter')

// https://sandyghai.github.io/AWS-S3-Multipart-Upload-Using-Presigned-Url/


export async function createAlbum(albumDetails) { // albumDetails = { title, pictures: []}
    try {
        let _apiAdapter;

        function _getPreSignedURLs() {
            _apiAdapter = apiAdapter('http://localhost:4000');

            return new Promise((resolve, reject) => {

                for (let picObj in albumDetails.pictures) {
                    delete picObj.file
                }

                _apiAdapter.post('/api/album', albumDetails)
                    .then(res => {
                        resolve(res.data.preSignedUrls)
                    })
                    .catch(err => {
                        console.log("... err ...", err);
                        reject(err);
                    })
            })
        }

        async function _uploadPics(preSignedUrls) {
            try {
                let t1 = performance.now();

                // 1. prepareFiles() function call: array (match each signedUrl to its file, and generate new Function)
                async function __prepareFiles() {
                    const files = albumDetails.pictures,
                        preparedFiles = [];

                    for (let url of preSignedUrls) {
                        let obj = files.find((file) => file.name === url.fileName)
                        preparedFiles.push({ rawFile: obj.file, uploadUrl: url.url })
                    }

                    return preparedFiles;
                }

                // 2. pushToS3(preparedFiles)
                function __pushToS3(preparedFiles) {
                    const promises = [];
                    return new Promise((resolve, reject) => {
                        for (let file of preparedFiles) {
                            console.log("FFFFFFFFFF", file);
                            promises.push(axios.put(file.uploadUrl, file.rawFile, { headers: { 'Content-Type': file.rawFile.type } }))
                        }

                        Promise.all(promises)
                            .then(() => {  // .then(resolve)
                                resolve();
                            })
                            .catch(err => {
                                console.log(">>>>>>>>>> error >>>>>>", err)
                            })
                    })
                }// end _pushToS3

                const preparedFiles = await __prepareFiles();
                await __pushToS3(preparedFiles);
                
                let t2 = performance.now();

                console.log(`>>>>> upload album took ${ t2 - t1 }  ms. >>>>` );

            } catch (e) {
                console.log(">>>> e >>>>", e);
            }
        } // end _uploadPics

        /*
        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        function _uploadOnePic(preSignedUrls) {
            const file = albumDetails.pictures[0].file;
            console.log(">>>> file >>>>", file);
            return new Promise((resolve, reject) => {
                // _apiAdapter = apiAdapter(preSignedUrls[0]);

                axios.put(preSignedUrls[0], file, { headers: { 'Content-Type': file.type } })
                    .then((res => {
                        console.log(">>>>> res >>>>", res.data);
                        resolve()
                    }))
                    .catch((err) => {
                        console.log(">>>>>>>>>> error >>>>>>", err)
                    })
            })
        }
        //////////////////////////////////////////////////
        /////////////////////////////////////////////////
        /////////////////////////////////////////////////
        */


        const preSignedUrls = await _getPreSignedURLs();
        await _uploadPics(preSignedUrls);
        console.log(">>>>>  Send the response to the user : the files is album photos is uploaded successfully >>>>>");
        
    


    } catch (e) {

    }

}



