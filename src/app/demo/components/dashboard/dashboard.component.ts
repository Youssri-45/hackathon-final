import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

    items!: MenuItem[];

    products!: Product[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    constructor(private productService: ProductService, public layoutService: LayoutService) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
            this.initChart();
        });
    }

    ngOnInit() {
        this.initChart();
        this.productService.getProductsSmall().then(data => this.products = data);

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Current emission',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    tension: .4
                },
                {
                    label: 'New emission',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: .4
                },
                {
                    label: 'Buy Thermostat',
                    data: [8, 46, 78, 25, 16, 7, 80],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--pink-600'),
                    borderColor: documentStyle.getPropertyValue('--pink-600'),
                    tension: .8
                },
                {
                    label: 'LED lights',
                    data: [18, 13, 41, 11, 15, 79, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
                    borderColor: documentStyle.getPropertyValue('--yellow-500'),
                    tension: .4
                },
                {
                    label: 'Replace old gadgets with 5-star gadget',
                    data: [81, 12, 31, 11, 18, 7, 89],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--indigo-500'),
                    borderColor: documentStyle.getPropertyValue('--indigo-500'),
                    tension: .4
                },
                {
                    label: 'Reduce Thermostat by 2 deg',
                    data: [9, 10.3, 17, 11, 49, 47, 9],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--teal-400'),
                    borderColor: documentStyle.getPropertyValue('--teal-400'),
                    tension: .4
                },
                {
                    label: 'Solar',
                    data: [5, 5.3, 7, 0.5, 4.9, 4.7, 9.4],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-300'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-300'),
                    tension: .4
                },
                {
                    label: 'Turn off devices on standby',
                    data: [2.3, 6.3, 7.4, 1.5, 14.9, 24.7, 11.4],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--purple-300'),
                    borderColor: documentStyle.getPropertyValue('--purple-300'),
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        // this.chartData.datasets.map((dataset : any , index : number)=>{
        //     if(index > 1){
                //this.chartData.datasets[0].data._chartjs.listeners[0]._cachedMeta.visible = false;
        //     }
        // });
    }
    
    hange() {
        let reductionList = [];
        
        
        this.chartData.datasets.map((dataset : any , index : number)=>{
            if(index > 1 && this.chartData.datasets[index].data._chartjs.listeners[0]._cachedMeta.visible === false){
                let product = {price : 1};
                let price = 1;
                product = this.products.find((product)=>product.name == dataset.label) as any;
                price = product != undefined ?product.price : 1;
                this.chartData.datasets[1].data.map((data : any , localIndex : number)=>{
                    this.chartData.datasets[1].data[localIndex] = data - data*(Number(price/3250));
                });
            }
            if(index > 1 && this.chartData.datasets[index].data._chartjs.listeners[0]._cachedMeta.visible == true){      
                let product = {price : 1};
                let price = 1;
                product = this.products.find((product)=>product.name === dataset.label) as any;
                price = product != undefined ?product.price : 1;
                this.chartData.datasets[1].data.map((data : any , localIndex : number)=>{
                    this.chartData.datasets[1].data[localIndex] = data - data*(Number(price/3250));
                });
            }
        })
        
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
