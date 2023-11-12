import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameFileDialogComponent } from './rename-file-dialog.component';

describe('RenameFileDialogComponent', () => {
  let component: RenameFileDialogComponent;
  let fixture: ComponentFixture<RenameFileDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RenameFileDialogComponent]
    });
    fixture = TestBed.createComponent(RenameFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
