import React from 'react';

const SkeletonLoader = () => {
  const styles = {
    skeletonLoader: {
      padding: '20px',
      background: '#f8f9fa',
      borderRadius: '8px',
    },
    loadingBanner: {
      background: '#e5e5e5', 
      color: '#666666', 
      padding: '30px', 
      textAlign: 'center', 
      marginBottom: '20px',
      borderRadius: '8px',
      fontWeight: 'bold',
      fontSize: '18px',
      minHeight: '100px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #d0d0d0'
    },
    summaryContainer: {
      display: 'flex', 
      gap: '20px', 
      marginBottom: '30px'
    },
    summaryCard: {
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', 
      backgroundSize: '200% 100%',
      height: '80px', 
      width: '200px', 
      borderRadius: '8px',
      animation: 'shimmer 1.5s infinite'
    },
    tablePlaceholder: {
      background: '#fafafa', 
      padding: '20px', 
      borderRadius: '8px',
      border: '1px solid #e0e0e0'
    },
    tableHeader: {
      background: '#e5e5e5', 
      height: '30px', 
      marginBottom: '10px', 
      borderRadius: '4px',
      animation: 'shimmer 1.5s infinite'
    },
    tableRow: {
      background: 'linear-gradient(90deg, #f8f8f8 25%, #e8e8e8 50%, #f8f8f8 75%)', 
      backgroundSize: '200% 100%',
      height: '40px', 
      marginBottom: '8px', 
      borderRadius: '4px',
      animation: 'shimmer 1.5s infinite'
    },
    smallText: {
      fontSize: '14px', 
      marginTop: '10px', 
      display: 'block'
    }
  };

  const shimmerAnimation = `
    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
  `;

  return (
    <div style={styles.skeletonLoader}>
      {/* Loading banner */}
      <div style={styles.loadingBanner}>
        Loading portfolio data
      </div>

      {/* Summary placeholder cards */}
      <div style={styles.summaryContainer}>
        <div style={styles.summaryCard}></div>
        <div style={styles.summaryCard}></div>
        <div style={styles.summaryCard}></div>
      </div>

      {/* Table placeholder */}
      <div style={styles.tablePlaceholder}>
        <div style={styles.tableHeader}></div>
        {[1, 2, 3, 4, 5].map(i => (
          <div 
            key={i} 
            style={{ 
              ...styles.tableRow, 
              animation: `shimmer 1.5s infinite ${i * 0.1}s`
            }}
          ></div>
        ))}
      </div>

      {/* CSS for animations */}
      <style dangerouslySetInnerHTML={{ __html: shimmerAnimation }} />
    </div>
  );
};

export default SkeletonLoader;
