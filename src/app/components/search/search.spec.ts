import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { SearchService } from '../../services/search';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let searchServiceMock: any;

  beforeEach(async () => {
    searchServiceMock = {
      getSuggestions: jasmine.createSpy('getSuggestions').and.returnValue(of([]))
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [SearchComponent],
      providers: [{ provide: SearchService, useValue: searchServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call searchService on input', () => {
    component.query = 'test';
    component.onInput();
    expect(searchServiceMock.getSuggestions).toHaveBeenCalledWith('test');
  });
});
