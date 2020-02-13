import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WebService } from 'src/app/service/webservice.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'create-usuario',
  templateUrl: './create-usuario.component.html',
  styleUrls: ['./create-usuario.component.css']
})
export class CreateUsuarioComponent implements OnInit {
  @Input() idUsuario;
  @Input() TypeButton;
  @Input() nameButton;
  @Output() modifyUsuario = new EventEmitter();

  public listUsuario:Array<any>=[];
  public modalReference:NgbModalRef;
  public formValidatorStatus:boolean;
  public formUsuario:FormGroup;

  get formValidator(){return this.formUsuario.controls}

  constructor(
    private webservice:WebService,
    private modalService: NgbModal,
    private formBuilder:FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
  }
  inicializator(){
    this.formValidatorStatus=false;
    this.inicializatorFormValidator();
    if(this.idUsuario != null){
      this.inicializatorEditUsuario();
    }
  }

  inicializatorFormValidator(){
    this.formUsuario = this.formBuilder.group({
      nombre:['',Validators.required],
      email:['',Validators.required],
      contacto:['',Validators.required],
    })
  }

  inicializatorEditUsuario(){
    this.webservice.getByIdUsuario(this.idUsuario).subscribe(
      response=>{
        this.validatorEditUsuario(response);
      },
      error=>{
        console.log(error);
        
      }
    )
  }
  
  showSuccess() {
    this.toastr.success('Nuevo Usuario Ingresado!!');
  }

  showUpdate(){
    this.toastr.success('Datos Actualizados!!');
  }

  saveSubmitUsuario(){
    this.formValidatorStatus=true;
    if(this.formUsuario.invalid){
      return;
    }
    if(this.idUsuario != null){
      this.updateUsuario();
    }
    else{
      this.saveUsuario();
    }
  }

  saveUsuario(){
    this.webservice.postUsuario(this.formUsuario.value).subscribe(
      response=>{
        this.modifyUsuario.emit(this.formUsuario.value);
        this.showSuccess();
        this.modalReference.close();
      },
      error=>{
        console.log(error);
      }
    )
  }

  updateUsuario(){
    this.webservice.putUsuario(this.formUsuario.value, this.idUsuario).subscribe(
      response=>{
        this.modifyUsuario.emit(this.formUsuario.value);
        this.showUpdate();
        this.modalReference.close();
      },
      error=>{
        console.log(error);
      }
    )
  }

  validatorEditUsuario(usuario){
    this.formUsuario.get('nombre').setValue(usuario.nombre);
    this.formUsuario.get('email').setValue(usuario.email);
    this.formUsuario.get('contacto').setValue(usuario.contacto);
  }

  mdCallModalService(mdUsuario) {
    this.inicializator();
    this.modalReference = this.modalService.open(mdUsuario, { size: 'lg', backdrop:'static' });
  }

}