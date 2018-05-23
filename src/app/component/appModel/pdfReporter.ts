import { forEach } from '@angular/router/src/utils/collection';
import { ProjectionModel} from './../appModel/projectionModel';
import { ImageDataFile } from './imageDataFile';
declare var jsPDF: any; // Important
declare let $:any;
import * as html2canvas from 'html2canvas';


export class PdfReporter{
    private doc:any;
    public outputResult:any;
    private lagosLogo :ImageDataFile = new ImageDataFile();
 
    public dataId: string[] = [
        "FEATURE ID",
        "ESTATE NAME",
        "BLOCK ID",
        "PLOT NUMBER",
        "PLAN NUMBER",
        "FEATURE SIZE (Sq.m)",
        "SEARCH-FEATURE SIZE (Sq.m)",
        "OVERLAPPING SIZE (Sq.m)",
        "PERCENTAGE OVERLAP",
        "STREET ID",
        "STREET NAME",
        "LCDA",
        "LGA",
        "CITY ",
        "REGION",
        "COUNTRY",
        "STATUS"
    ];

    public acqusitionDataId: string[] = [
        "DETECTED FEATURE S/N ",
        "DESCRIPTION",
        "REFERENCE NAME",
        "COMMITMENT STATUS",
        "GAZETTE NO.",
        "PUBLISH DATE",
        "OVERLAPPING SIZE (Sq.m)",
        "SIZE FREE (Sq.m)",
        "PERCENTAGE OVERLAP"
    ];

    public acqusitionDataSurmary_ID: string[] = [
        "TOTAL NUMBER OF OVERLAP ",
        "TOTAL OVERLAPPING SIZE (Sq.m)",
        "TOTAL PERCENTAGE OVERLAP ",
        "TOTAL SIZE FREE (Sq.m)",
        "LAND USE ZONING ",
        "ACQUISITION STATUS"
    ];

    private dataArrayQuery: any;
    private numOfFeatures: Number;

    public initWriterModule(dataArrayQuery, dataId){
        this.dataArrayQuery = this.getChattingData(dataArrayQuery, dataId);
        this.numOfFeatures = dataArrayQuery.length;
    }

  

    // Returns a new array each time to avoid pointer issues
    private getDetailColumns = function () {
        return [
            {title: "HEADING", dataKey: "heading"},
            {title: "DETAILS", dataKey: "detail"}
        ];
    };

    private getId_EastingNorthingColumns = function() {
        return[
            {title: "STATION ID", dataKey: "id"},
            {title: "EASTING (m)", dataKey: "easting"},
            {title: "NORTHING (m)", dataKey: "northing"}

        ];
    }



    private getChattingData(dataId,dataArrayQuery){
        const finalData = [];

        for(let i=0; i<dataArrayQuery.length; i++){
            const data = [];
            data.push({
                "field": dataId[i],
                "value": dataArrayQuery[i]
            });

            finalData.push(data);
        }


        return finalData;
    }

    public createPdf(
        ref_no:string,
        titleHolder: string,
        streetName:string,
        townName:string,
        cityName:string,
        planNo:string,
        planData,
        reportData,
        surmary,
        imgDataUrl
    ){

        const surmaryData = [
            {"field": "TOTAL NUMBER OF OVERLAP ", "value": surmary[0] },
            {"field": "INPUTED FEATURE SIZE ", "value": `${surmary[1]} (Sq.m)` },
            {"field": "TOTAL OVERLAPPING SIZE ", "value": `${surmary[2]} (Sq.m)`  },
            {"field": "TOTAL SIZE FREE", "value": `${surmary[4]} (Sq.m)` },
            {"field": "TOTAL PERCENTAGE OVERLAP ", "value": `${surmary[3]} (%)`},
            {"field": "ACQUISITION STATUS", "value": 
            `
                ${surmary[3]}% OF THE SIZE OF THE PIECE OF LAND
                DEPICTED BY THE INPUTED SPATIAL DATA ABOVE,
                FALL WITHIN KNOWN GOVERNMENT 
                ACQUISITION OR REVOCATION.

                WHILE  ${100-surmary[3]}% OF IT SIZE IS FREE FROM KNOWN
                GOVERNMENT ACQUISITION OR REVOCATION.
            ` }
        ]

        this.doc = new jsPDF('p', 'mm','a4');
        let posY;
        const width = this.doc.internal.pageSize.width;
        
        const logoX = (width/2)-20;

        // doc.setFontSize(40);
        // doc.text(35, 25, "Octonyan loves jsPDF");
        
        this.doc.addImage(this.lagosLogo.lagosLogo, 'JPEG', logoX, 5, 40, 30);
        this.doc.setFont("BoldOblique");
        this.doc.setFontSize(14);
        this.doc.setTextColor(200, 6, 47);
        this.doc.text(logoX-13, 40, "LAGOS STATE GOVERNMENT ");

        

        this.doc.setFont("normal");
        this.doc.setFontSize(12);
        this.doc.setTextColor(5, 0, 1);
        this.doc.text(10, 70, `Ref. No: ${ref_no}`);
        this.doc.text(width-50, 70, `Date: ${this.getCurrentDate()}`);

        this.doc.text(10, 80, ` ${titleHolder},`);
        this.doc.text(10, 88, ` ALONG ${streetName},`);
        this.doc.text(10, 96, ` ${townName},`);
        this.doc.text(10, 104, ` ${cityName}.`);

        this.doc.text(logoX-10, 119, ` LAND INFORMATION CERTIFICATE `);
        this.doc.text(logoX-10, 119, `__________________________________`);

        this.doc.text(logoX-10, 126, ` SURVEY PLAN No: ${planNo} `);
        this.doc.text(logoX-10, 126, `_________________________________`);

        //REPORT BODY CONTENT GOES HERE
        this.doc.text(10, 135, `
        This certificate is generated in regard to your submition on ${this.getCurrentDate()}, for Land Information covering 
        the piece of land covered by the Survey Plan information stated below:
        `);

        const columns_4_inputCoor = [
            {title: "BEACON ID", dataKey: "id"},
            {title: "EASTING (m)", dataKey: "x"}, 
            {title: "NORTHING (m)", dataKey: "y"}
        ];

        const columns_4_ItemReport = [
            {title: "FIELD", dataKey: "field"},
            {title: "VALUE", dataKey: "value"}
        ]



        this.doc.autoTable(columns_4_inputCoor, planData, {
            
            headerStyles: {
                halign: 'center',
                fillColor: [62, 96, 72]
            },
            styles: {fillColor: [100, 255, 255]},
            columnStyles: {
                
                id: {
                    fillColor: [247, 249, 249],
                    halign: 'center',
                    lineWidth: .2,
                    lineColor: 200
                },
                x:{
                    fillColor: [217, 219, 219],
                    halign: 'center',
                    lineWidth: .2,
                    lineColor: 200                    
                },
                y:{
                    fillColor: [237, 237, 237],
                    halign: 'center',
                    lineWidth: .2,
                    lineColor: 200
                }
            },
            margin: {top: 148, right: 20, left:20},
            theme: 'grid',
            tableLineColor: [26, 51, 86], // number, array (see color section below)
            tableLineWidth: .2,
        });

        posY = this.doc.autoTable.previous;

        this.doc.text(10, posY.finalY + 5, `
        In respect to the above spatial data, the following Charting Information were derived:
        `);

        if(reportData.length=== 1){
            this.doc.autoTable(columns_4_ItemReport, reportData[0], {
                startY: posY.finalY + 20,
                showHeader: 'never',
                headerStyles: {
                    halign: 'center',
                    fillColor: [62, 96, 72]
                },
                styles: {fillColor: [100, 255, 255]},
                columnStyles: {
                    
                    field: {
                        fillColor: [62, 96, 72],
                        halign: 'center',
                        lineWidth: .1,
                        lineColor: 200,
                        textColor: [255,255,255],
                        fontStyle: 'bold', // normal, bold, 
                    },
                    value:{
                        fillColor: [247, 249, 249],
                        halign: 'center',
                        lineWidth: .1,
                        lineColor: 200
                                           
                    }
                },
                margin: {right: 20, left:20},
                theme: 'grid',
                tableLineColor: [26, 51, 86], // number, array (see color section below)
                tableLineWidth: .2
            });
            if((this.doc.internal.pageSize.height-posY.finalY)<=120){
                this.doc.addPage();
            }

            this.doc.text(10, 10, `
            OVERALL SURMARY:
            `);
            this.doc.text(10, 10, `
            _________________
            `);

            this.doc.autoTable(columns_4_ItemReport, surmaryData, {
                startY: 20,
                showHeader: 'never',
                headerStyles: {
                    halign: 'center',
                    fillColor: [62, 96, 72]
                },
                styles: {fillColor: [100, 255, 255]},
                columnStyles: {
                    
                    field: {
                        fillColor: [62, 96, 72],
                        halign: 'center',
                        lineWidth: .1,
                        lineColor: 200,
                        textColor: [255,255,255],
                        fontStyle: 'bold', // normal, bold, 
                    },
                    value:{
                        fillColor: [247, 249, 249],
                        halign: 'center',
                        lineWidth: .1,
                        lineColor: 200
                                           
                    }
                },
                margin: {top: posY, right: 20, left:20},
                theme: 'grid',
                tableLineColor: [26, 51, 86], // number, array (see color section below)
                tableLineWidth: .2
            });

            this.doc.addPage();
            posY = 10;
            this.doc.text(10,posY,'MAP PAGE DESCRIPTION SHOWING THE CHARTING RESULT');
            this.doc.text(10,posY,'_____________________________________________________');

            this.doc.addImage(imgDataUrl, 'JPEG', 15, posY+10, this.doc.internal.pageSize.width-30, this.doc.internal.pageSize.height-150);

            posY = this.doc.internal.pageSize.height-150;

            if(surmary[3]<=1.0){
                this.doc.text(0, posY+25,
    `
    The above information is given provided the coordinates inputed into this application is correct 
    in respect to the ones quoted on the survey plan. 
    Any erasure, alteration, forgery or cancellation renders this certificate null and void.

    You are hereby advised to apply to the Land Use and Allocation Directorate for a Certificate of Occupancy,
    Please.
    `
                );
            } else{
                this.doc.text(10, posY+25,
                `
    The above information is given provided the coordinates inputed into this application is correct 
    in respect to the ones quoted on the survey plan. 

    Any erasure, alteration, forgery or cancellation renders this certificate null and void.
    THANKS.
                `                    
                );
                
            }

            this.doc.text(this.doc.internal.pageSize.width-100,this.doc.internal.pageSize.height-10,
                `For: Surveyor General / Permanent Secretary.`)


        }else{
            this.doc.autoTable(columns_4_ItemReport, reportData[0], {
                startY: posY.finalY + 20,
                showHeader: 'never',
                headerStyles: {
                    halign: 'center',
                    fillColor: [62, 96, 72]
                },
                
                columnStyles: {
                    
                    field: {
                        fillColor: [62, 96, 72],
                        halign: 'center',
                        lineWidth: .1,
                        lineColor: 200,
                        textColor: [255,255,255],
                        fontStyle: 'bold' // normal, bold, 
                    },
                    value:{
                        fillColor: [247, 249, 249],
                        halign: 'center',
                        lineWidth: .1,
                        lineColor: 200                  
                    }
                },
                margin: {top: posY, right: 20, left:20},
                theme: 'grid',
                tableLineColor: [26, 51, 86], // number, array (see color section below)
                tableLineWidth: .1
            });

            for(let i=1; i<reportData.length; i++){
                

                if((this.doc.internal.pageSize.height-posY.finalY)<=120){
                    this.doc.addPage();
                    posY.finalY =10;  // Initializing the begining of a new page
                    this.doc.autoTable(columns_4_ItemReport, reportData[i], {
                        startY: posY.finalY + 10,
                        showHeader: 'never',
                        headerStyles: {
                            halign: 'center',
                            fillColor: [62, 96, 72]
                        },
                        styles: {fillColor: [100, 255, 255]},
                        columnStyles: {
                            
                            field: {
                                fillColor: [62, 96, 72],
                                halign: 'center',
                                lineWidth: .1,
                                lineColor: 200,
                                textColor: [255,255,255],
                                fontStyle: 'bold', // normal, bold, 
                            },
                            value:{
                                fillColor: [247, 249, 249],
                                halign: 'center',
                                lineWidth: .5,
                                lineColor: 200                    
                            }
                        },
                        margin: {top: posY, right: 20, left:20},
                        theme: 'grid',
                        tableLineColor: [26, 51, 86], // number, array (see color section below)
                        tableLineWidth: .1
                    });
                    
                } else{
                    this.doc.autoTable(columns_4_ItemReport, reportData[i], {
                        startY: posY.finalY + 20,
                        showHeader: 'never',
                        headerStyles: {
                            halign: 'center',
                            fillColor: [62, 96, 72]
                        },
                        styles: {fillColor: [100, 255, 255]},
                        columnStyles: {
                            
                            field: {
                                fillColor: [62, 96, 72],
                                halign: 'center',
                                lineWidth: .1,
                                lineColor: 200,
                                textColor: [255,255,255],
                                fontStyle: 'bold', // normal, bold, 
                            },
                            value:{
                                fillColor: [247, 249, 249],
                                halign: 'center',
                                lineWidth: .5,
                                lineColor: 200                    
                            }
                        },
                        margin: {top: posY, right: 20, left:20},
                        theme: 'grid',
                        tableLineColor: [26, 51, 86], // number, array (see color section below)
                        tableLineWidth: .1
                    });
                }

    
            }

            posY = this.doc.autoTable.previous;
            this.doc.text(10, posY.finalY + 10, `
            OVERALL SURMARY:
            `);
            this.doc.text(10, posY.finalY+ 10, `
            _________________
            `);

    



            this.doc.autoTable(columns_4_ItemReport, surmaryData, {
                startY: posY.finalY+20,
                showHeader: 'never',
                headerStyles: {
                    halign: 'center',
                    fillColor: [62, 96, 72]
                },
                styles: {fillColor: [100, 255, 255]},
                columnStyles: {
                    
                    field: {
                        fillColor: [62, 96, 72],
                        halign: 'center',
                        lineWidth: .1,
                        lineColor: 200,
                        textColor: [255,255,255],
                        fontStyle: 'bold', // normal, bold, 
                    },
                    value:{
                        fillColor: [247, 249, 249],
                        halign: 'center',
                        lineWidth: .1,
                        lineColor: 200
                                           
                    }
                },
                margin: {top: posY, right: 20, left:20},
                theme: 'grid',
                tableLineColor: [26, 51, 86], // number, array (see color section below)
                tableLineWidth: .2
            });

            this.doc.addPage();
            posY = 10;
            this.doc.text(10,posY,'MAP PAGE DESCRIPTION SHOWING THE CHARTING RESULT');
            this.doc.text(10,posY,'_____________________________________________________');


            this.doc.addImage(imgDataUrl, 'JPEG', 15, posY+10, this.doc.internal.pageSize.width-30, this.doc.internal.pageSize.height-150);

            posY = this.doc.internal.pageSize.height-150;

            if(surmary[3]<=1.0){
                this.doc.text(0, posY+25,
    `
    The above information is given provided the coordinates inputed into this application is correct 
    in respect to the ones quoted on the survey plan. 
    Any erasure, alteration, forgery or cancellation renders this certificate null and void.

    You are hereby advised to apply to the Land Use and Allocation Directorate for a Certificate of Occupancy,
    Please.
    `
                );
            } else{
                this.doc.text(10, posY+25,
                `
    The above information is given provided the coordinates inputed into this application is correct 
    in respect to the ones quoted on the survey plan. 

    Any erasure, alteration, forgery or cancellation renders this certificate null and void.
    THANKS.
                `                    
                );
                
            }

            this.doc.text(this.doc.internal.pageSize.width-100,this.doc.internal.pageSize.height-10,
                `For: Surveyor General / Permanent Secretary.`)
        }



        // This is to inform you that the piece of land covered by the 
        // This Land Information Certificate is generated in respect to your 

        this.outputResult = this.doc.output('datauristring');
    }

    public getCurrentDate():string{
        today = new Date();
        let dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        
        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
            mm='0'+mm;
        } 
        var today = dd+'/'+mm+'/'+yyyy;
        return today;
    }
    
}














        // var width = doc.internal.pageSize.width;    
        // var height = doc.internal.pageSize.height;
        // var options = {
        //      pagesplit: true
        // };
        // doc.text(10, 20, 'Crazy Monkey');
        // var h1=50;
        // var aspectwidth1= (height-h1)*(9/16);
        // doc.addImage(imgData, 'JPEG', 10, h1, aspectwidth1, (height-h1), 'monkey');
        // doc.addPage();
        // doc.text(10, 20, 'Hello World');
        // var h2=30;
        // var aspectwidth2= (height-h2)*(9/16);
        // doc.addImage(imgData, 'JPEG', 10, h2, aspectwidth2, (height-h2), 'monkey');
        // // console.log(doc)
        // console.log(doc.output('datauristring'));