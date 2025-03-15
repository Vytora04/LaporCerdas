
document.addEventListener('DOMContentLoaded', function() {
    const hideResolvedCheckbox = document.getElementById('hide-resolved');
    
    hideResolvedCheckbox.addEventListener('change', function() {
        const resolvedReports = document.querySelectorAll('.sl-resolved');
        
        resolvedReports.forEach(report => {
            if (hideResolvedCheckbox.checked) {
                report.classList.add('hidden');
            } else {
                report.classList.remove('hidden');
            }
        });
    });
});