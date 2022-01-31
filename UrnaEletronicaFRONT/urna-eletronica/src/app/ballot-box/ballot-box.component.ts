import { CandidateService } from './../../services/candidate.service';
import { VoteModule } from './../models/vote.module';
import { VoteService } from './../../services/vote.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ballot-box',
  templateUrl: './ballot-box.component.html',
  styleUrls: ['./ballot-box.component.css'],
})
export class BallotBoxComponent implements OnInit {
  screenVote: string = 'election';
  voteModel: VoteModule = new VoteModule();
  candidateList: any = [];
  @ViewChild('firstDigit') firstDigit: ElementRef;
  @ViewChild('lastDigit') lastDigit: ElementRef;
  @ViewChild('currentCandidate') currentCandidate: ElementRef;

  constructor(
    public voteService: VoteService,
    public candidateService: CandidateService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getCandidates();
  }

  playAudio(src: string) {
    let audio = new Audio();
    audio.src = '../../../assets/audios/' + src;
    audio.load();
    audio.play();
  }

  insertVote(voteModel: VoteModule) {
    this.voteService.registerVote(voteModel).subscribe({
      next: (response) => {
        this.toastr.success('Voto computado com sucesso.');
        this.screenVote = 'end';
        this.playAudio('confirm.wav');
      },
      error: (error) => {
        this.toastr.error(
          'Voto não foi computado. Verifique a conexão com a API.'
        );
      },
    });
  }

  restartVote() {
    this.screenVote = 'election';
  }

  confirmVote() {
    if (
      this.firstDigit.nativeElement.value === '' ||
      this.lastDigit.nativeElement.value === ''
    ) {
      this.toastr.error('Digite ambos os números para prosseguir.');
      return;
    }

    let valueVote: Number = parseInt(
      this.firstDigit.nativeElement.value + this.lastDigit.nativeElement.value
    );
    if (this.verifyIfCandidateIsNull(valueVote)) {
      this.voteModel.candidateId = 101;
    } else {
      this.voteModel.candidateId = valueVote;
    }

    this.insertVote(this.voteModel);
  }

  whiteVote() {
    this.voteModel.candidateId = 100;

    this.insertVote(this.voteModel);
  }

  correctVote() {
    this.firstDigit.nativeElement.value = '';
    this.lastDigit.nativeElement.value = '';
    this.currentCandidate.nativeElement.innerText = '';

    this.playAudio('key.wav');
  }

  insertNumber(value: Number) {
    let value1: string = this.firstDigit.nativeElement.value;
    let value2: string = this.lastDigit.nativeElement.value;

    if (value1 == '') {
      this.firstDigit.nativeElement.value = value;
    } else if (value2 == '') {
      this.lastDigit.nativeElement.value = value;

      let valueVote: Number = parseInt(
        this.firstDigit.nativeElement.value + this.lastDigit.nativeElement.value
      );

      this.changeCandidateProfile(valueVote);
    }

    this.playAudio('key.wav');
  }

  getCandidates() {
    this.candidateService.getCandidatesList().subscribe({
      next: (response) => {
        this.candidateList = response;
      },
      error: (error) => {
        this.toastr.error(
          'Falha ao carregar os candidatos, verifique a conexão com a API.'
        );
      },
    });
  }

  changeCandidateProfile(valueVote: Number) {
    for (let candidate of this.candidateList) {
      if (valueVote === parseInt(candidate.label)) {
        this.currentCandidate.nativeElement.innerText =
          candidate.fullName + '\n' + candidate.viceName;
        break;
      }
      if (valueVote !== parseInt(candidate.label)) {
        this.currentCandidate.nativeElement.innerText =
          'Candidato Inválido\n Confirme para Voto Nulo';
      }
    }
  }

  verifyIfCandidateIsNull(valueVote: Number) {
    for (let candidate of this.candidateList) {
      if (valueVote !== parseInt(candidate.label)) {
        return true;
      }
    }

    return false;
  }
}
