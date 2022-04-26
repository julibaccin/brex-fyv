import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertsService } from 'src/app/services/alerts.service';
import { AuthService } from 'src/app/services/auth.service';
import { PropertiesService } from 'src/app/services/properties.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
})
export class PanelComponent implements OnInit {
  profileForm: FormGroup;
  productForm: FormGroup;
  products: any = [];
  files: File[] = [];
  @ViewChildren('preViewImages', {}) preViewImages: QueryList<
    ElementRef<HTMLImageElement>
  >;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private alert: AlertsService,
    private property: PropertiesService
  ) {
    this.profileForm = this.fb.group({
      phone: ['', [Validators.required]],
      whatsapp: [''],
      interesGastos: [0],
      interesPersonales12: [0],
      interesPersonales36: [0],
      interesPrendarios12: [0],
      interesPrendarios36: [0],
    });
    this.productForm = this.fb.group({
      title: [''],
      description: [''],
      category: ['Vehiculos'],
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getProfile();
    await this.getProperties();
  }

  async getProperties() {
    this.products = await this.auth.getMyProperties();
  }

  async getProfile() {
    let profile = await this.auth.getProfile();
    if (profile) this.profileForm.patchValue(profile);
  }

  async handleUpdateClick(property: any) {
    this.clearPreviewAndFiles();
    if (property) {
      this.productForm.patchValue(property);
      property.urlPhotos.forEach((url: string, index: number) => {
        if (this.preViewImages) {
          this.preViewImages.toArray()[index].nativeElement.src = url;
        }
      });
    }
  }

  async handleRefreshProfile() {
    if (this.profileForm.invalid) {
      this.alert.error('Formulario Invalido');
      return;
    }
    await this.auth.createOrUpdateProfile(this.profileForm.value);
    this.alert.success('Actualización correcta');
  }

  async uploadFile(event: Event) {
    this.clearPreviewAndFiles();
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      const propertyValues = Object.values(fileList);
      if (propertyValues.length > 3) {
        this.alert.warning(
          'No puede cargar mas de 3 imagenes, por favor cargue nuevamente las imagenes'
        );
        element.value = '';
        return;
      }
      this.files = propertyValues;
      this.showPreviewImages();
    }
  }

  showPreviewImages() {
    this.files.forEach((file, index) => {
      this.preViewImages.toArray()[index].nativeElement.src =
        URL.createObjectURL(file);
    });
  }

  async handleCreateProduct() {
    // Upload images
    const urls = await this.property.addImg('properties', this.files);
    //

    await this.property.addProperty({
      ...this.productForm.value,
      urlPhotos: urls,
    });
    await this.getProperties();
    this.alert.success('Producto cargado');
    this.productForm.reset();
  }

  async handleDeleteProperty(property: any) {
    await this.property.deleteProperty(property);
    this.products = this.products.filter((p: any) => p.id != property.id);
    this.alert.success('Producto eliminado con éxito');
  }

  async handleChangeActive(property: any) {
    await this.property.changeActive(property);
    property.active = !property.active;
  }

  async handleClearForm() {
    this.clearPreviewAndFiles();
    this.productForm.reset({
      title: [''],
      description: [''],
      category: ['Vehiculos'],
    });
  }

  clearPreviewAndFiles() {
    this.files = [];
    this.preViewImages?.toArray().forEach((preViewImage) => {
      preViewImage.nativeElement.src = '';
    });
  }
}
